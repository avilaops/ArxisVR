using System.Drawing;
using System.Runtime.Versioning;
using System.Drawing.Imaging;
using Silk.NET.OpenGL;
using GLPixelFormat = Silk.NET.OpenGL.PixelFormat;
using DrawingPixelFormat = System.Drawing.Imaging.PixelFormat;

namespace ArxisVR.Tools;

/// <summary>
/// Captures screenshots of the 3D viewport
/// </summary>
[SupportedOSPlatform("windows")]
public class ScreenshotCapture
{
    private GL? _gl;

    public event Action<string>? OnScreenshotSaved;
    public event Action<string>? OnError;

    public void Initialize(GL gl)
    {
        _gl = gl;
    }

    public void CaptureScreenshot(int width, int height, string? customPath = null)
    {
        if (_gl == null)
        {
            OnError?.Invoke("OpenGL context not initialized");
            return;
        }

        try
        {
            // Read pixels from framebuffer
            var pixels = new byte[width * height * 4]; // RGBA

            unsafe
            {
                fixed (byte* ptr = pixels)
                {
                    _gl.ReadPixels(0, 0, (uint)width, (uint)height, GLPixelFormat.Rgba, PixelType.UnsignedByte, ptr);
                }
            }

            // Create bitmap and flip vertically (OpenGL has origin at bottom-left)
            var bitmap = new Bitmap(width, height, DrawingPixelFormat.Format32bppArgb);

            var bitmapData = bitmap.LockBits(
                new Rectangle(0, 0, width, height),
                ImageLockMode.WriteOnly,
                DrawingPixelFormat.Format32bppArgb
            );

            unsafe
            {
                byte* bmpPtr = (byte*)bitmapData.Scan0;

                // Copy and flip vertically
                for (int y = 0; y < height; y++)
                {
                    int srcY = height - 1 - y; // Flip Y
                    for (int x = 0; x < width; x++)
                    {
                        int srcIndex = (srcY * width + x) * 4;
                        int dstIndex = (y * width + x) * 4;

                        // RGBA to BGRA
                        bmpPtr[dstIndex + 0] = pixels[srcIndex + 2]; // B
                        bmpPtr[dstIndex + 1] = pixels[srcIndex + 1]; // G
                        bmpPtr[dstIndex + 2] = pixels[srcIndex + 0]; // R
                        bmpPtr[dstIndex + 3] = pixels[srcIndex + 3]; // A
                    }
                }
            }

            bitmap.UnlockBits(bitmapData);

            // Save to file
            var filePath = customPath ?? GenerateScreenshotPath();
            var directory = Path.GetDirectoryName(filePath);

            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            bitmap.Save(filePath, ImageFormat.Png);
            bitmap.Dispose();

            OnScreenshotSaved?.Invoke(filePath);
        }
        catch (Exception ex)
        {
            OnError?.Invoke($"Failed to capture screenshot: {ex.Message}");
        }
    }

    public void CaptureScreenshotJpeg(int width, int height, int quality = 90, string? customPath = null)
    {
        if (_gl == null)
        {
            OnError?.Invoke("OpenGL context not initialized");
            return;
        }

        try
        {
            // Read pixels
            var pixels = new byte[width * height * 4];

            unsafe
            {
                fixed (byte* ptr = pixels)
                {
                    _gl.ReadPixels(0, 0, (uint)width, (uint)height, GLPixelFormat.Rgba, PixelType.UnsignedByte, ptr);
                }
            }

            // Create bitmap
            var bitmap = new Bitmap(width, height, DrawingPixelFormat.Format24bppRgb);

            var bitmapData = bitmap.LockBits(
                new Rectangle(0, 0, width, height),
                ImageLockMode.WriteOnly,
                DrawingPixelFormat.Format24bppRgb
            );

            unsafe
            {
                byte* bmpPtr = (byte*)bitmapData.Scan0;

                for (int y = 0; y < height; y++)
                {
                    int srcY = height - 1 - y;
                    for (int x = 0; x < width; x++)
                    {
                        int srcIndex = (srcY * width + x) * 4;
                        int dstIndex = (y * width + x) * 3;

                        bmpPtr[dstIndex + 0] = pixels[srcIndex + 2]; // B
                        bmpPtr[dstIndex + 1] = pixels[srcIndex + 1]; // G
                        bmpPtr[dstIndex + 2] = pixels[srcIndex + 0]; // R
                    }
                }
            }

            bitmap.UnlockBits(bitmapData);

            // Save as JPEG
            var filePath = customPath ?? GenerateScreenshotPath(".jpg");
            var directory = Path.GetDirectoryName(filePath);

            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var encoderParams = new EncoderParameters(1);
            encoderParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);

            var jpegCodec = GetEncoderInfo("image/jpeg");
            if (jpegCodec != null)
            {
                bitmap.Save(filePath, jpegCodec, encoderParams);
            }
            else
            {
                bitmap.Save(filePath, ImageFormat.Jpeg);
            }

            bitmap.Dispose();

            OnScreenshotSaved?.Invoke(filePath);
        }
        catch (Exception ex)
        {
            OnError?.Invoke($"Failed to capture screenshot: {ex.Message}");
        }
    }

    private string GenerateScreenshotPath(string extension = ".png")
    {
        var screenshotsDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyPictures), "ArxisVR");
        var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
        var filename = $"ArxisVR_screenshot_{timestamp}{extension}";

        return Path.Combine(screenshotsDir, filename);
    }

    private ImageCodecInfo? GetEncoderInfo(string mimeType)
    {
        var encoders = ImageCodecInfo.GetImageEncoders();
        return encoders.FirstOrDefault(e => e.MimeType == mimeType);
    }
}
