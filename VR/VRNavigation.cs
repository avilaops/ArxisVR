using System.Numerics;

namespace ArxisVR.VR;

/// <summary>
/// Navigation system for VR with teleportation and smooth locomotion - Optimized
/// </summary>
public class VRNavigation
{
    // Constants for performance and configuration
    private const float DEFAULT_TELEPORT_SPEED = 5.0f;
    private const float DEFAULT_SMOOTH_SPEED = 3.0f;
    private const float DEFAULT_TELEPORT_MAX_DISTANCE = 20.0f;
    private const float DEFAULT_GROUND_LEVEL = -1.0f;
    private const float MOVEMENT_THRESHOLD = 0.1f;
    private const float TELEPORT_COMPLETE_THRESHOLD = 1.0f;

    private Vector3 _teleportTarget;
    private bool _isTeleporting;
    private float _teleportProgress;
    private Vector3 _teleportStartPos;
    private Vector3 _lastValidPosition;

    public bool EnableTeleport { get; set; } = true;
    public bool EnableSmoothLocomotion { get; set; } = true;
    public float TeleportSpeed { get; set; } = DEFAULT_TELEPORT_SPEED;
    public float SmoothSpeed { get; set; } = DEFAULT_SMOOTH_SPEED;
    public float TeleportMaxDistance { get; set; } = DEFAULT_TELEPORT_MAX_DISTANCE;

    // Teleport visualization
    public Vector3? TeleportTarget => _isTeleporting ? _teleportTarget : null;
    public bool IsTeleportValid { get; private set; }

    // Smooth locomotion direction
    public Vector2 MovementInput { get; set; }

    public event Action<Vector3>? OnTeleportComplete;
    public event Action<string>? OnNavigationMessage;

    public void StartTeleport(Vector3 target, bool isValid)
    {
        if (!EnableTeleport) return;

        _teleportTarget = target;
        IsTeleportValid = isValid;
    }

    public void ExecuteTeleport(Vector3 currentPosition)
    {
        if (!EnableTeleport || !IsTeleportValid) return;

        _isTeleporting = true;
        _teleportProgress = 0.0f;
        _teleportStartPos = currentPosition;

        OnNavigationMessage?.Invoke($"Teleporting to {_teleportTarget}");
    }

    public void CancelTeleport()
    {
        _isTeleporting = false;
        IsTeleportValid = false;
    }

    public Vector3 Update(Vector3 currentPosition, Vector3 forward, Vector3 right, float deltaTime)
    {
        Vector3 newPosition = currentPosition;

        // Handle teleport animation
        if (_isTeleporting)
        {
            _teleportProgress += TeleportSpeed * deltaTime;

            if (_teleportProgress >= TELEPORT_COMPLETE_THRESHOLD)
            {
                newPosition = _teleportTarget;
                _isTeleporting = false;
                _lastValidPosition = newPosition;
                OnTeleportComplete?.Invoke(newPosition);
                OnNavigationMessage?.Invoke($"Teleport complete - Position: {newPosition:F2}");
            }
            else
            {
                // Smooth interpolation with easing
                float easedProgress = EaseInOutQuad(_teleportProgress);
                newPosition = Vector3.Lerp(_teleportStartPos, _teleportTarget, easedProgress);
            }
        }
        // Handle smooth locomotion
        else if (EnableSmoothLocomotion && MovementInput.Length() > MOVEMENT_THRESHOLD)
        {
            Vector3 moveDirection = forward * MovementInput.Y + right * MovementInput.X;

            // Normalize only if needed (performance)
            float length = moveDirection.Length();
            if (length > 0.001f)
            {
                moveDirection /= length;
                moveDirection.Y = 0; // Keep on ground plane

                newPosition += moveDirection * SmoothSpeed * deltaTime;
                _lastValidPosition = newPosition;
            }
        }

        return newPosition;
    }

    /// <summary>
    /// Easing function for smooth teleport animation
    /// </summary>
    private float EaseInOutQuad(float t)
    {
        return t < 0.5f ? 2 * t * t : 1 - MathF.Pow(-2 * t + 2, 2) / 2;
    }

    public bool ValidateTeleportTarget(Vector3 target, Vector3 currentPosition)
    {
        // Check distance (squared for performance)
        float distanceSquared = Vector3.DistanceSquared(currentPosition, target);
        float maxDistanceSquared = TeleportMaxDistance * TeleportMaxDistance;

        if (distanceSquared > maxDistanceSquared)
        {
            OnNavigationMessage?.Invoke($"Target too far: {MathF.Sqrt(distanceSquared):F1}m (max: {TeleportMaxDistance:F1}m)");
            return false;
        }

        // Check if target is on ground
        if (target.Y < DEFAULT_GROUND_LEVEL)
        {
            OnNavigationMessage?.Invoke($"Invalid ground level: {target.Y:F2}m");
            return false;
        }

        return true;
    }

    /// <summary>
    /// Get last valid position (for recovery)
    /// </summary>
    public Vector3 GetLastValidPosition() => _lastValidPosition;
}

/// <summary>
/// VR gesture recognition for intuitive controls - Optimized
/// </summary>
public class VRGestures
{
    // Constants for gesture detection
    private const float DEFAULT_GRAB_THRESHOLD = 0.8f;
    private const float DEFAULT_SWIPE_THRESHOLD = 0.5f;
    private const float GESTURE_COOLDOWN = 0.3f; // Prevent repeated detections
    private const float MIN_GESTURE_DISTANCE = 0.1f;

    private Vector3 _lastLeftControllerPos;
    private Vector3 _lastRightControllerPos;
    private bool _isGrabbing;
    private float _gestureCooldownTimer;
    private GestureType? _lastGesture;

    public bool EnableGestures { get; set; } = true;
    public float GrabThreshold { get; set; } = DEFAULT_GRAB_THRESHOLD;
    public float SwipeThreshold { get; set; } = DEFAULT_SWIPE_THRESHOLD;

    public event Action<GestureType>? OnGestureDetected;
    public event Action<string>? OnGestureMessage;

    public void Update(Vector3 leftControllerPos, Vector3 rightControllerPos,
                      bool leftGripPressed, bool rightGripPressed, float deltaTime)
    {
        if (!EnableGestures) return;

        // Update cooldown timer
        if (_gestureCooldownTimer > 0)
        {
            _gestureCooldownTimer -= deltaTime;
            if (_gestureCooldownTimer <= 0)
            {
                _lastGesture = null;
            }
        }

        // Detect two-handed grab for scaling
        if (leftGripPressed && rightGripPressed && !_isGrabbing)
        {
            _isGrabbing = true;
            TriggerGesture(GestureType.TwoHandGrab, "Two-hand grab: Scale model");
        }
        else if (!leftGripPressed || !rightGripPressed)
        {
            _isGrabbing = false;
        }

        // Detect swipe gestures (only if not in cooldown)
        if (_gestureCooldownTimer <= 0)
        {
            Vector3 leftDelta = leftControllerPos - _lastLeftControllerPos;
            Vector3 rightDelta = rightControllerPos - _lastRightControllerPos;

            // Check if movement is significant enough
            float rightMovement = rightDelta.Length();
            if (rightMovement > MIN_GESTURE_DISTANCE)
            {
                // Right hand swipe left
                if (rightDelta.X < -SwipeThreshold)
                {
                    TriggerGesture(GestureType.SwipeLeft, "Swipe left: Previous view");
                }
                // Right hand swipe right
                else if (rightDelta.X > SwipeThreshold)
                {
                    TriggerGesture(GestureType.SwipeRight, "Swipe right: Next view");
                }
                // Right hand swipe up
                else if (rightDelta.Y > SwipeThreshold)
                {
                    TriggerGesture(GestureType.SwipeUp, "Swipe up: Show menu");
                }
                // Right hand swipe down
                else if (rightDelta.Y < -SwipeThreshold)
                {
                    TriggerGesture(GestureType.SwipeDown, "Swipe down: Hide menu");
                }
            }
        }

        _lastLeftControllerPos = leftControllerPos;
        _lastRightControllerPos = rightControllerPos;
    }

    private void TriggerGesture(GestureType gesture, string message)
    {
        if (_lastGesture == gesture) return; // Prevent duplicates

        _lastGesture = gesture;
        _gestureCooldownTimer = GESTURE_COOLDOWN;

        OnGestureDetected?.Invoke(gesture);
        OnGestureMessage?.Invoke(message);
    }

    /// <summary>
    /// Reset gesture detection state
    /// </summary>
    public void Reset()
    {
        _gestureCooldownTimer = 0;
        _lastGesture = null;
        _isGrabbing = false;
    }
}

public enum GestureType
{
    SwipeLeft,
    SwipeRight,
    SwipeUp,
    SwipeDown,
    TwoHandGrab,
    Pinch,
    Point
}
