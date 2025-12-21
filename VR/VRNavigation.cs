using System.Numerics;

namespace Vizzio.VR;

/// <summary>
/// Navigation system for VR with teleportation and smooth locomotion
/// </summary>
public class VRNavigation
{
    private Vector3 _teleportTarget;
    private bool _isTeleporting;
    private float _teleportProgress;
    private Vector3 _teleportStartPos;
    
    public bool EnableTeleport { get; set; } = true;
    public bool EnableSmoothLocomotion { get; set; } = true;
    public float TeleportSpeed { get; set; } = 5.0f;
    public float SmoothSpeed { get; set; } = 3.0f;
    public float TeleportMaxDistance { get; set; } = 20.0f;
    
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
            
            if (_teleportProgress >= 1.0f)
            {
                newPosition = _teleportTarget;
                _isTeleporting = false;
                OnTeleportComplete?.Invoke(newPosition);
                OnNavigationMessage?.Invoke("Teleport complete");
            }
            else
            {
                // Smooth interpolation
                newPosition = Vector3.Lerp(_teleportStartPos, _teleportTarget, _teleportProgress);
            }
        }
        // Handle smooth locomotion
        else if (EnableSmoothLocomotion && MovementInput.Length() > 0.1f)
        {
            Vector3 moveDirection = forward * MovementInput.Y + right * MovementInput.X;
            moveDirection = Vector3.Normalize(moveDirection);
            moveDirection.Y = 0; // Keep on ground plane
            
            newPosition += moveDirection * SmoothSpeed * deltaTime;
        }
        
        return newPosition;
    }

    public bool ValidateTeleportTarget(Vector3 target, Vector3 currentPosition)
    {
        // Check distance
        float distance = Vector3.Distance(currentPosition, target);
        if (distance > TeleportMaxDistance)
            return false;
        
        // Check if target is on ground (Y > -1)
        if (target.Y < -1.0f)
            return false;
        
        return true;
    }
}

/// <summary>
/// VR gesture recognition for intuitive controls
/// </summary>
public class VRGestures
{
    private Vector3 _lastLeftControllerPos;
    private Vector3 _lastRightControllerPos;
    private bool _isGrabbing;
    
    public bool EnableGestures { get; set; } = true;
    public float GrabThreshold { get; set; } = 0.8f;
    public float SwipeThreshold { get; set; } = 0.5f;
    
    public event Action<GestureType>? OnGestureDetected;
    public event Action<string>? OnGestureMessage;

    public void Update(Vector3 leftControllerPos, Vector3 rightControllerPos, 
                      bool leftGripPressed, bool rightGripPressed)
    {
        if (!EnableGestures) return;
        
        // Detect two-handed grab for scaling
        if (leftGripPressed && rightGripPressed && !_isGrabbing)
        {
            _isGrabbing = true;
            OnGestureDetected?.Invoke(GestureType.TwoHandGrab);
            OnGestureMessage?.Invoke("Two-hand grab: Scale model");
        }
        else if (!leftGripPressed || !rightGripPressed)
        {
            _isGrabbing = false;
        }
        
        // Detect swipe gestures
        Vector3 leftDelta = leftControllerPos - _lastLeftControllerPos;
        Vector3 rightDelta = rightControllerPos - _lastRightControllerPos;
        
        // Right hand swipe left
        if (rightDelta.X < -SwipeThreshold)
        {
            OnGestureDetected?.Invoke(GestureType.SwipeLeft);
            OnGestureMessage?.Invoke("Swipe left: Previous view");
        }
        // Right hand swipe right
        else if (rightDelta.X > SwipeThreshold)
        {
            OnGestureDetected?.Invoke(GestureType.SwipeRight);
            OnGestureMessage?.Invoke("Swipe right: Next view");
        }
        // Right hand swipe up
        else if (rightDelta.Y > SwipeThreshold)
        {
            OnGestureDetected?.Invoke(GestureType.SwipeUp);
            OnGestureMessage?.Invoke("Swipe up: Show menu");
        }
        
        _lastLeftControllerPos = leftControllerPos;
        _lastRightControllerPos = rightControllerPos;
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
