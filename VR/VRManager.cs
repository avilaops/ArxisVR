using System.Numerics;
using Vizzio.Rendering;

namespace Vizzio.VR;

/// <summary>
/// Manages VR/AR integration and stereoscopic rendering
/// </summary>
public class VRManager
{
    private bool _isVREnabled;
    private bool _isAREnabled;
    private OpenXRManager? _openXRManager;
    
    public bool IsVREnabled
    {
        get => _isVREnabled;
        set
        {
            _isVREnabled = value;
            if (value) _isAREnabled = false;
            OnVRStateChanged?.Invoke(value);
        }
    }

    public bool IsAREnabled
    {
        get => _isAREnabled;
        set
        {
            _isAREnabled = value;
            if (value) _isVREnabled = false;
            OnARStateChanged?.Invoke(value);
        }
    }

    public float IPD { get; set; } = 0.064f; // Interpupillary distance in meters
    public float HeadHeight { get; set; } = 1.7f; // Default head height in meters

    public event Action<bool>? OnVRStateChanged;
    public event Action<bool>? OnARStateChanged;
    public event Action<string>? OnVRMessage;

    // VR device tracking
    public Vector3 HeadPosition { get; set; }
    public Quaternion HeadRotation { get; set; }
    public Vector3 LeftControllerPosition { get; set; }
    public Vector3 RightControllerPosition { get; set; }

    public VRManager()
    {
        HeadPosition = new Vector3(0, HeadHeight, 0);
        HeadRotation = Quaternion.Identity;
    }

    public void Initialize()
    {
        OnVRMessage?.Invoke("VR/AR Manager initialized.");
        
        // Try to initialize OpenXR
        try
        {
            _openXRManager = new OpenXRManager();
            _openXRManager.OnMessage += (msg) => OnVRMessage?.Invoke($"[OpenXR] {msg}");
            _openXRManager.OnError += (msg) => OnVRMessage?.Invoke($"[OpenXR ERROR] {msg}");
            
            if (_openXRManager.Initialize())
            {
                OnVRMessage?.Invoke("OpenXR runtime detected and initialized!");
                OnVRMessage?.Invoke("Use F2 to enable VR mode.");
            }
            else
            {
                OnVRMessage?.Invoke("OpenXR not available. VR features will use simulation mode.");
                _openXRManager = null;
            }
        }
        catch (Exception ex)
        {
            OnVRMessage?.Invoke($"OpenXR initialization failed: {ex.Message}");
            OnVRMessage?.Invoke("VR features will use simulation mode.");
            _openXRManager = null;
        }
    }

    public void Update(float deltaTime)
    {
        if (_openXRManager != null && _isVREnabled)
        {
            _openXRManager.Update();
        }
        else if (_isVREnabled)
        {
            UpdateVRTracking();
        }
        else if (_isAREnabled)
        {
            UpdateARTracking();
        }
    }

    private void UpdateVRTracking()
    {
        // Simulated VR tracking when OpenXR is not available
        // In a real implementation with OpenXR, tracking data comes from _openXRManager
    }

    private void UpdateARTracking()
    {
        // Simulated AR tracking
        // In a full implementation, this would handle AR camera tracking
    }

    public (Matrix4x4 left, Matrix4x4 right) GetStereoscopicViewMatrices(Camera camera)
    {
        // Use OpenXR if available and VR is enabled
        if (_openXRManager != null && _openXRManager.IsSessionRunning && _isVREnabled)
        {
            try
            {
                var matrices = _openXRManager.GetViewMatrices(camera);
                if (matrices.Length >= 2)
                {
                    return (matrices[0].view, matrices[1].view);
                }
            }
            catch (Exception ex)
            {
                OnVRMessage?.Invoke($"Error getting OpenXR views: {ex.Message}");
            }
        }

        // Fallback to simulated stereoscopic rendering
        if (!_isVREnabled)
        {
            var view = camera.GetViewMatrix();
            return (view, view);
        }

        // Calculate eye offset based on IPD
        var eyeOffset = IPD * 0.5f;
        var right = camera.Right;

        // Left eye position
        var leftEyePos = camera.Position - right * eyeOffset;
        var leftView = Matrix4x4.CreateLookAt(leftEyePos, leftEyePos + camera.Front, camera.Up);

        // Right eye position
        var rightEyePos = camera.Position + right * eyeOffset;
        var rightView = Matrix4x4.CreateLookAt(rightEyePos, rightEyePos + camera.Front, camera.Up);

        return (leftView, rightView);
    }

    public (Matrix4x4 left, Matrix4x4 right) GetStereoscopicProjectionMatrices(Camera camera)
    {
        // Use OpenXR if available and VR is enabled
        if (_openXRManager != null && _openXRManager.IsSessionRunning && _isVREnabled)
        {
            try
            {
                var matrices = _openXRManager.GetViewMatrices(camera);
                if (matrices.Length >= 2)
                {
                    return (matrices[0].projection, matrices[1].projection);
                }
            }
            catch (Exception ex)
            {
                OnVRMessage?.Invoke($"Error getting OpenXR projections: {ex.Message}");
            }
        }

        // Fallback
        var projection = camera.GetProjectionMatrix();
        return (projection, projection);
    }

    public void EnableVRMode(Camera camera)
    {
        // Try to start OpenXR session
        if (_openXRManager != null && _openXRManager.IsInitialized)
        {
            if (!_openXRManager.IsSessionRunning)
            {
                if (_openXRManager.CreateSession())
                {
                    if (_openXRManager.BeginSession())
                    {
                        IsVREnabled = true;
                        OnVRMessage?.Invoke("VR Mode enabled with OpenXR.");
                        return;
                    }
                }
            }
            else
            {
                IsVREnabled = true;
                OnVRMessage?.Invoke("VR Mode enabled with OpenXR.");
                return;
            }
        }

        // Fallback to simulation mode
        IsVREnabled = true;
        camera.Position = HeadPosition;
        OnVRMessage?.Invoke("VR Mode enabled (simulation mode - no headset detected).");
    }

    public void DisableVRMode()
    {
        IsVREnabled = false;
        OnVRMessage?.Invoke("VR Mode disabled.");
    }

    public void EnableARMode(Camera camera)
    {
        IsAREnabled = true;
        OnVRMessage?.Invoke("AR Mode enabled. Point device at surface to place model.");
    }

    public void DisableARMode()
    {
        IsAREnabled = false;
        OnVRMessage?.Invoke("AR Mode disabled.");
    }

    public void ToggleVRMode(Camera camera)
    {
        if (_isVREnabled)
        {
            DisableVRMode();
        }
        else
        {
            EnableVRMode(camera);
        }
    }

    public void ToggleARMode(Camera camera)
    {
        if (_isAREnabled)
        {
            DisableARMode();
        }
        else
        {
            EnableARMode(camera);
        }
    }

    public string GetVRDeviceInfo()
    {
        if (!_isVREnabled)
        {
            return "VR Mode: Disabled";
        }

        if (_openXRManager != null && _openXRManager.IsInitialized)
        {
            var status = _openXRManager.IsSessionRunning ? "Running" : "Initialized";
            return $"VR Mode: ACTIVE\n" +
                   $"Runtime: OpenXR\n" +
                   $"Status: {status}\n" +
                   $"IPD: {IPD * 1000:F1}mm";
        }

        return $"VR Mode: ACTIVE (Simulation)\n" +
               $"Device: Simulated VR Device\n" +
               $"IPD: {IPD * 1000:F1}mm\n" +
               $"Note: No OpenXR runtime detected";
    }

    public string GetARDeviceInfo()
    {
        if (!_isAREnabled)
        {
            return "AR Mode: Disabled";
        }

        return $"AR Mode: ACTIVE (Simulation)\n" +
               $"Device: Simulated AR Device\n" +
               $"Tracking State: Tracking";
    }

    public void Dispose()
    {
        _openXRManager?.Dispose();
    }
}
