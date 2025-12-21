using System.Numerics;

namespace Vizzio.Rendering;

/// <summary>
/// Represents a 3D camera with FPS-style and orbital controls
/// </summary>
public class Camera
{
    private Vector3 _position;
    private Vector3 _front;
    private Vector3 _up;
    private Vector3 _right;
    private float _yaw;
    private float _pitch;
    
    // Orbital camera controls
    private Vector3 _targetPoint;
    private float _distance;
    private bool _isOrbitMode;
    
    public Vector3 Position
    {
        get => _position;
        set => _position = value;
    }

    public Vector3 Front => _front;
    public Vector3 Up => _up;
    public Vector3 Right => _right;
    
    public Vector3 TargetPoint
    {
        get => _targetPoint;
        set
        {
            _targetPoint = value;
            if (_isOrbitMode)
                UpdateOrbitPosition();
        }
    }
    
    public bool IsOrbitMode
    {
        get => _isOrbitMode;
        set
        {
            _isOrbitMode = value;
            if (value)
            {
                // Calculate initial orbit parameters
                _distance = Vector3.Distance(_position, _targetPoint);
                CalculateOrbitAngles();
            }
        }
    }

    public float Yaw
    {
        get => _yaw;
        set
        {
            _yaw = value;
            if (_isOrbitMode)
                UpdateOrbitPosition();
            else
                UpdateVectors();
        }
    }

    public float Pitch
    {
        get => _pitch;
        set
        {
            _pitch = Math.Clamp(value, -89.0f, 89.0f);
            if (_isOrbitMode)
                UpdateOrbitPosition();
            else
                UpdateVectors();
        }
    }

    public float Fov { get; set; } = 45.0f;
    public float AspectRatio { get; set; } = 16.0f / 9.0f;
    public float NearPlane { get; set; } = 0.1f;
    public float FarPlane { get; set; } = 10000.0f;

    // Movement speeds
    public float MovementSpeed { get; set; } = 10.0f;
    public float MouseSensitivity { get; set; } = 0.1f;
    public float ZoomSpeed { get; set; } = 2.0f;
    public float OrbitSpeed { get; set; } = 0.3f;
    public float PanSpeed { get; set; } = 0.01f;

    public Camera(Vector3 position)
    {
        _position = position;
        _yaw = -90.0f;
        _pitch = 0.0f;
        _up = Vector3.UnitY;
        _targetPoint = Vector3.Zero;
        _distance = 10.0f;
        _isOrbitMode = false;
        UpdateVectors();
    }

    public Matrix4x4 GetViewMatrix()
    {
        return Matrix4x4.CreateLookAt(_position, _position + _front, _up);
    }

    public Matrix4x4 GetProjectionMatrix()
    {
        return Matrix4x4.CreatePerspectiveFieldOfView(
            Fov * (float)Math.PI / 180.0f,
            AspectRatio,
            NearPlane,
            FarPlane
        );
    }

    public void ProcessKeyboard(CameraMovement direction, float deltaTime)
    {
        if (_isOrbitMode)
        {
            // In orbit mode, WASD moves the target point
            float velocity = MovementSpeed * deltaTime;
            
            switch (direction)
            {
                case CameraMovement.Forward:
                    _targetPoint += _front * velocity;
                    UpdateOrbitPosition();
                    break;
                case CameraMovement.Backward:
                    _targetPoint -= _front * velocity;
                    UpdateOrbitPosition();
                    break;
                case CameraMovement.Left:
                    _targetPoint -= _right * velocity;
                    UpdateOrbitPosition();
                    break;
                case CameraMovement.Right:
                    _targetPoint += _right * velocity;
                    UpdateOrbitPosition();
                    break;
                case CameraMovement.Up:
                    _distance = Math.Max(0.5f, _distance - velocity);
                    UpdateOrbitPosition();
                    break;
                case CameraMovement.Down:
                    _distance += velocity;
                    UpdateOrbitPosition();
                    break;
            }
        }
        else
        {
            // FPS mode - normal movement
            float velocity = MovementSpeed * deltaTime;

            switch (direction)
            {
                case CameraMovement.Forward:
                    _position += _front * velocity;
                    break;
                case CameraMovement.Backward:
                    _position -= _front * velocity;
                    break;
                case CameraMovement.Left:
                    _position -= _right * velocity;
                    break;
                case CameraMovement.Right:
                    _position += _right * velocity;
                    break;
                case CameraMovement.Up:
                    _position += _up * velocity;
                    break;
                case CameraMovement.Down:
                    _position -= _up * velocity;
                    break;
            }
        }
    }

    public void ProcessMouseMovement(float xOffset, float yOffset, bool constrainPitch = true)
    {
        if (_isOrbitMode)
        {
            xOffset *= OrbitSpeed;
            yOffset *= OrbitSpeed;

            Yaw += xOffset;
            Pitch += yOffset;
            
            if (constrainPitch)
                Pitch = Math.Clamp(Pitch, -89.0f, 89.0f);
        }
        else
        {
            xOffset *= MouseSensitivity;
            yOffset *= MouseSensitivity;

            Yaw += xOffset;
            Pitch += yOffset;
            
            if (constrainPitch)
                Pitch = Math.Clamp(Pitch, -89.0f, 89.0f);
        }
    }

    public void ProcessMousePan(float xOffset, float yOffset)
    {
        if (_isOrbitMode)
        {
            // Pan the target point
            _targetPoint -= _right * xOffset * PanSpeed * _distance;
            _targetPoint += _up * yOffset * PanSpeed * _distance;
            UpdateOrbitPosition();
        }
        else
        {
            // Pan the camera
            _position -= _right * xOffset * PanSpeed * 10.0f;
            _position += _up * yOffset * PanSpeed * 10.0f;
        }
    }

    public void ProcessMouseScroll(float yOffset)
    {
        if (_isOrbitMode)
        {
            // Zoom in/out by changing distance
            _distance = Math.Max(0.5f, _distance - yOffset * ZoomSpeed);
            UpdateOrbitPosition();
        }
        else
        {
            // Adjust FOV
            Fov -= yOffset * ZoomSpeed;
            Fov = Math.Clamp(Fov, 1.0f, 90.0f);
        }
    }

    public void LookAt(Vector3 target, Vector3 up)
    {
        _front = Vector3.Normalize(target - _position);
        _right = Vector3.Normalize(Vector3.Cross(_front, up));
        _up = Vector3.Cross(_right, _front);

        // Calculate yaw and pitch from front vector
        _yaw = (float)Math.Atan2(_front.Z, _front.X) * 180.0f / (float)Math.PI;
        _pitch = (float)Math.Asin(_front.Y) * 180.0f / (float)Math.PI;
        
        _targetPoint = target;
        _distance = Vector3.Distance(_position, target);
    }

    public void FocusOn(Vector3 target, float distance)
    {
        _targetPoint = target;
        _distance = distance;
        
        if (_isOrbitMode)
        {
            UpdateOrbitPosition();
        }
        else
        {
            var direction = Vector3.Normalize(_front);
            _position = target - direction * distance;
        }
    }

    public void SetCameraPreset(CameraPreset preset, Vector3 modelCenter, float modelSize)
    {
        _targetPoint = modelCenter;
        _distance = modelSize * 2.0f;
        
        switch (preset)
        {
            case CameraPreset.Top:
                _pitch = -89.0f;
                _yaw = -90.0f;
                break;
            case CameraPreset.Bottom:
                _pitch = 89.0f;
                _yaw = -90.0f;
                break;
            case CameraPreset.Front:
                _pitch = 0.0f;
                _yaw = -90.0f;
                break;
            case CameraPreset.Back:
                _pitch = 0.0f;
                _yaw = 90.0f;
                break;
            case CameraPreset.Left:
                _pitch = 0.0f;
                _yaw = 180.0f;
                break;
            case CameraPreset.Right:
                _pitch = 0.0f;
                _yaw = 0.0f;
                break;
            case CameraPreset.Isometric:
                _pitch = -35.26f;
                _yaw = -45.0f;
                break;
        }
        
        if (_isOrbitMode)
        {
            UpdateOrbitPosition();
        }
        else
        {
            UpdateVectors();
            _position = _targetPoint - _front * _distance;
        }
    }

    private void UpdateOrbitPosition()
    {
        // Convert spherical coordinates to cartesian
        float pitchRad = _pitch * (float)Math.PI / 180.0f;
        float yawRad = _yaw * (float)Math.PI / 180.0f;
        
        Vector3 offset = new Vector3(
            (float)(Math.Cos(pitchRad) * Math.Cos(yawRad)),
            (float)Math.Sin(pitchRad),
            (float)(Math.Cos(pitchRad) * Math.Sin(yawRad))
        );
        
        _position = _targetPoint - offset * _distance;
        _front = Vector3.Normalize(_targetPoint - _position);
        _right = Vector3.Normalize(Vector3.Cross(_front, Vector3.UnitY));
        _up = Vector3.Normalize(Vector3.Cross(_right, _front));
    }

    private void CalculateOrbitAngles()
    {
        Vector3 direction = Vector3.Normalize(_position - _targetPoint);
        
        _yaw = (float)Math.Atan2(direction.Z, direction.X) * 180.0f / (float)Math.PI;
        _pitch = (float)Math.Asin(direction.Y) * 180.0f / (float)Math.PI;
    }

    private void UpdateVectors()
    {
        var front = new Vector3
        {
            X = (float)(Math.Cos(Yaw * Math.PI / 180.0) * Math.Cos(Pitch * Math.PI / 180.0)),
            Y = (float)Math.Sin(Pitch * Math.PI / 180.0),
            Z = (float)(Math.Sin(Yaw * Math.PI / 180.0) * Math.Cos(Pitch * Math.PI / 180.0))
        };

        _front = Vector3.Normalize(front);
        _right = Vector3.Normalize(Vector3.Cross(_front, Vector3.UnitY));
        _up = Vector3.Normalize(Vector3.Cross(_right, _front));
    }
}

public enum CameraMovement
{
    Forward,
    Backward,
    Left,
    Right,
    Up,
    Down
}

public enum CameraPreset
{
    Top,
    Bottom,
    Front,
    Back,
    Left,
    Right,
    Isometric
}
