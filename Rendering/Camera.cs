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

    // Smooth navigation (CS-inspired)
    private Vector3 _velocity = Vector3.Zero;
    private float _currentSpeed = 0f;
    private float _targetFov = 45.0f;
    private float _fovVelocity = 0f;
    public float Acceleration { get; set; } = 25.0f;
    public float Deceleration { get; set; } = 15.0f;
    public float MaxSpeed { get; set; } = 20.0f;
    public float SpeedMultiplierFast { get; set; } = 3.0f;
    public float SpeedMultiplierSlow { get; set; } = 0.3f;
    public bool SmoothMovement { get; set; } = true;

    // CS-style movement
    private float _bobTimer = 0f;
    private float _bobAmount = 0f;
    public bool EnableHeadBob { get; set; } = true;
    public float BobFrequency { get; set; } = 12.0f;
    public float BobAmplitude { get; set; } = 0.05f;
    public float SprintSpeed { get; set; } = 1.8f;
    public float CrouchSpeed { get; set; } = 0.5f;
    public bool IsSprinting { get; set; } = false;
    public bool IsCrouching { get; set; } = false;
    private float _crouchTransition = 0f;
    private float _sprintFovBoost = 0f;

    // Advanced physics
    public float AirControl { get; set; } = 0.3f;
    public float Friction { get; set; } = 8.0f;
    public float StopSpeed { get; set; } = 1.0f;

    // Velocity tracking for speedometer
    public float CurrentVelocity => _velocity.Length();
    public Vector3 VelocityVector => _velocity;

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
        Vector3 bobOffset = Vector3.Zero;

        if (EnableHeadBob && !_isOrbitMode && _velocity.Length() > 0.5f)
        {
            // Head bob effect
            float bobX = MathF.Sin(_bobTimer) * BobAmplitude * 0.5f;
            float bobY = MathF.Abs(MathF.Cos(_bobTimer * 2)) * BobAmplitude;

            bobOffset = _right * bobX + _up * bobY;
        }

        Vector3 viewPosition = _position + bobOffset;
        return Matrix4x4.CreateLookAt(viewPosition, viewPosition + _front, _up);
    }

    public Matrix4x4 GetProjectionMatrix()
    {
        // Add FOV boost when sprinting (CS-style)
        float sprintFovBonus = IsSprinting ? 5.0f : 0.0f;
        float finalFov = Fov + sprintFovBonus + _sprintFovBoost;

        return Matrix4x4.CreatePerspectiveFieldOfView(
            finalFov * (float)Math.PI / 180.0f,
            AspectRatio,
            NearPlane,
            FarPlane
        );
    }

    public void ProcessKeyboard(CameraMovement direction, float deltaTime, float speedMultiplier = 1.0f)
    {
        if (_isOrbitMode)
        {
            // In orbit mode, WASD moves the target point
            float velocity = MovementSpeed * speedMultiplier * deltaTime;

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
            // CS-style movement with proper acceleration
            Vector3 wishDir = Vector3.Zero;

            switch (direction)
            {
                case CameraMovement.Forward:
                    wishDir = _front;
                    break;
                case CameraMovement.Backward:
                    wishDir = -_front;
                    break;
                case CameraMovement.Left:
                    wishDir = -_right;
                    break;
                case CameraMovement.Right:
                    wishDir = _right;
                    break;
                case CameraMovement.Up:
                    wishDir = _up;
                    break;
                case CameraMovement.Down:
                    wishDir = -_up;
                    break;
            }

            // Flatten movement on horizontal plane (ignore Y for WASD)
            if (direction != CameraMovement.Up && direction != CameraMovement.Down)
            {
                wishDir.Y = 0;
                if (wishDir.Length() > 0)
                    wishDir = Vector3.Normalize(wishDir);
            }

            // Calculate speed modifiers
            float moveSpeed = MovementSpeed;

            if (IsSprinting && (direction == CameraMovement.Forward))
            {
                moveSpeed *= SprintSpeed;
            }
            else if (IsCrouching)
            {
                moveSpeed *= CrouchSpeed;
            }
            else
            {
                moveSpeed *= speedMultiplier;
            }

            // Apply acceleration (CS-style)
            float currentSpeed = Vector3.Dot(_velocity, wishDir);
            float addSpeed = moveSpeed - currentSpeed;

            if (addSpeed > 0)
            {
                float accelSpeed = Acceleration * deltaTime * moveSpeed;
                if (accelSpeed > addSpeed)
                    accelSpeed = addSpeed;

                _velocity += wishDir * accelSpeed;
            }

            // Clamp velocity
            float speedLength = _velocity.Length();
            if (speedLength > moveSpeed)
            {
                _velocity = _velocity / speedLength * moveSpeed;
            }

            // Update position
            _position += _velocity * deltaTime;

            // Update head bob
            if (_velocity.Length() > 0.1f)
            {
                float bobSpeedMult = IsSprinting ? 1.3f : 1.0f;
                _bobTimer += BobFrequency * bobSpeedMult * deltaTime;
            }
            else
            {
                _bobTimer = 0f;
            }
        }
    }

    public void ApplyDeceleration(float deltaTime)
    {
        if (SmoothMovement && !_isOrbitMode)
        {
            // CS-style friction
            float speed = _velocity.Length();

            if (speed > 0.1f)
            {
                float drop = 0f;

                // Apply friction
                float control = speed < StopSpeed ? StopSpeed : speed;
                drop = control * Friction * deltaTime;

                float newSpeed = Math.Max(speed - drop, 0f);
                if (newSpeed > 0)
                    newSpeed /= speed;

                _velocity *= newSpeed;
            }
            else
            {
                _velocity = Vector3.Zero;
            }

            // Smooth sprint FOV transition
            float targetSprintFov = IsSprinting ? 5.0f : 0.0f;
            _sprintFovBoost = _sprintFovBoost + (targetSprintFov - _sprintFovBoost) * (8.0f * deltaTime);

            _position += _velocity * deltaTime;
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
            // Smooth FOV adjustment
            _targetFov -= yOffset * ZoomSpeed;
            _targetFov = Math.Clamp(_targetFov, 10.0f, 90.0f);
        }
    }

    public void UpdateSmoothZoom(float deltaTime)
    {
        if (!_isOrbitMode && Math.Abs(Fov - _targetFov) > 0.1f)
        {
            // Smooth damp for FOV
            float diff = _targetFov - Fov;
            _fovVelocity += diff * 8.0f * deltaTime;
            _fovVelocity *= (1.0f - 6.0f * deltaTime);
            Fov += _fovVelocity * deltaTime;
            Fov = Math.Clamp(Fov, 10.0f, 90.0f);
        }
    }

    public void FocusOnPoint(Vector3 point, float distance = 10.0f)
    {
        _targetPoint = point;
        _distance = distance;
        _isOrbitMode = true;
        UpdateOrbitPosition();
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

    /// <summary>
    /// Resets camera to a safe default orientation looking at the target
    /// </summary>
    public void ResetOrientation()
    {
        _pitch = 0.0f;
        _yaw = -90.0f;
        _velocity = Vector3.Zero;
        _bobTimer = 0f;

        if (_isOrbitMode)
        {
            UpdateOrbitPosition();
        }
        else
        {
            UpdateVectors();
        }
    }

    /// <summary>
    /// Levels the camera (removes pitch rotation) - useful when stuck upside down
    /// </summary>
    public void LevelCamera()
    {
        _pitch = 0.0f;

        if (_isOrbitMode)
        {
            UpdateOrbitPosition();
        }
        else
        {
            UpdateVectors();
        }
    }

    /// <summary>
    /// Corrects the camera if it's upside down
    /// </summary>
    public void CorrectUpsideDown()
    {
        // If pitch is beyond safe limits, bring it back
        if (_pitch > 85.0f)
        {
            _pitch = 85.0f;
        }
        else if (_pitch < -85.0f)
        {
            _pitch = -85.0f;
        }

        if (_isOrbitMode)
        {
            UpdateOrbitPosition();
        }
        else
        {
            UpdateVectors();
        }
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
