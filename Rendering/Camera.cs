using System.Numerics;

namespace Vizzio.Rendering;

/// <summary>
/// Represents a 3D camera with FPS-style controls
/// </summary>
public class Camera
{
    private Vector3 _position;
    private Vector3 _front;
    private Vector3 _up;
    private Vector3 _right;
    private float _yaw;
    private float _pitch;
    
    public Vector3 Position
    {
        get => _position;
        set => _position = value;
    }

    public Vector3 Front => _front;
    public Vector3 Up => _up;
    public Vector3 Right => _right;

    public float Yaw
    {
        get => _yaw;
        set
        {
            _yaw = value;
            UpdateVectors();
        }
    }

    public float Pitch
    {
        get => _pitch;
        set
        {
            _pitch = Math.Clamp(value, -89.0f, 89.0f);
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

    public Camera(Vector3 position)
    {
        _position = position;
        _yaw = -90.0f;
        _pitch = 0.0f;
        _up = Vector3.UnitY;
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

    public void ProcessMouseMovement(float xOffset, float yOffset)
    {
        xOffset *= MouseSensitivity;
        yOffset *= MouseSensitivity;

        Yaw += xOffset;
        Pitch += yOffset;
    }

    public void ProcessMouseScroll(float yOffset)
    {
        Fov -= yOffset * ZoomSpeed;
        Fov = Math.Clamp(Fov, 1.0f, 90.0f);
    }

    public void LookAt(Vector3 target, Vector3 up)
    {
        _front = Vector3.Normalize(target - _position);
        _right = Vector3.Normalize(Vector3.Cross(_front, up));
        _up = Vector3.Cross(_right, _front);

        // Calculate yaw and pitch from front vector
        _yaw = (float)Math.Atan2(_front.Z, _front.X) * 180.0f / (float)Math.PI;
        _pitch = (float)Math.Asin(_front.Y) * 180.0f / (float)Math.PI;
    }

    public void FocusOn(Vector3 target, float distance)
    {
        var direction = Vector3.Normalize(_front);
        _position = target - direction * distance;
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
