using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using ImGuiNET;
using Vizzio.Services;

namespace Vizzio.UI
{
    /// <summary>
    /// UI Panel for managing multiple loaded IFC models
    /// </summary>
    public class ModelManagerPanel
    {
        private readonly IfcModelCache _cache;
        private bool _isOpen = true;
        private string _searchFilter = string.Empty;
        private SortColumn _sortColumn = SortColumn.LastAccessed;
        private bool _sortDescending = true;
        private bool _showLoadDialog = false;
        private List<string> _selectedFiles = new();

        public bool IsOpen
        {
            get => _isOpen;
            set => _isOpen = value;
        }

        public ModelManagerPanel(IfcModelCache cache)
        {
            _cache = cache;
        }

        public void Render()
        {
            if (!_isOpen)
                return;

            ImGui.SetNextWindowSize(new Vector2(800, 600), ImGuiCond.FirstUseEver);
            
            if (ImGui.Begin("Model Manager", ref _isOpen, ImGuiWindowFlags.MenuBar))
            {
                RenderMenuBar();
                RenderToolbar();
                RenderModelList();
                RenderStatusBar();
            }
            
            ImGui.End();

            if (_showLoadDialog)
                RenderLoadDialog();
        }

        private void RenderMenuBar()
        {
            if (ImGui.BeginMenuBar())
            {
                if (ImGui.BeginMenu("File"))
                {
                    if (ImGui.MenuItem("Load Model...", "Ctrl+O"))
                    {
                        _showLoadDialog = true;
                    }

                    if (ImGui.MenuItem("Load Multiple...", "Ctrl+Shift+O"))
                    {
                        _showLoadDialog = true;
                    }

                    ImGui.Separator();

                    if (ImGui.MenuItem("Close All", null, false, _cache.CachedModelCount > 0))
                    {
                        _cache.Clear();
                    }

                    ImGui.EndMenu();
                }

                if (ImGui.BeginMenu("View"))
                {
                    ImGui.MenuItem("Sort by Name", null, _sortColumn == SortColumn.Name);
                    if (ImGui.IsItemClicked())
                        _sortColumn = SortColumn.Name;

                    ImGui.MenuItem("Sort by Size", null, _sortColumn == SortColumn.Size);
                    if (ImGui.IsItemClicked())
                        _sortColumn = SortColumn.Size;

                    ImGui.MenuItem("Sort by Elements", null, _sortColumn == SortColumn.Elements);
                    if (ImGui.IsItemClicked())
                        _sortColumn = SortColumn.Elements;

                    ImGui.MenuItem("Sort by Last Accessed", null, _sortColumn == SortColumn.LastAccessed);
                    if (ImGui.IsItemClicked())
                        _sortColumn = SortColumn.LastAccessed;

                    ImGui.Separator();

                    ImGui.MenuItem("Descending", null, ref _sortDescending);

                    ImGui.EndMenu();
                }

                ImGui.EndMenuBar();
            }
        }

        private void RenderToolbar()
        {
            // Search bar
            ImGui.SetNextItemWidth(200);
            ImGui.InputTextWithHint("##search", "🔍 Search models...", ref _searchFilter, 256);

            ImGui.SameLine();
            
            // Quick stats
            var stats = _cache.GetCachedModels();
            var totalElements = stats.Sum(s => s.ElementCount);
            var totalMemory = stats.Sum(s => s.EstimatedSize);

            ImGui.TextColored(new Vector4(0.5f, 0.5f, 0.5f, 1), 
                $"📊 {stats.Count} models | {totalElements:N0} elements | {FormatBytes(totalMemory)}");

            ImGui.SameLine(ImGui.GetWindowWidth() - 120);

            if (ImGui.Button("🔄 Refresh"))
            {
                // Refresh will happen on next render
            }

            ImGui.SameLine();

            if (ImGui.Button("➕ Load"))
            {
                _showLoadDialog = true;
            }

            ImGui.Separator();
        }

        private void RenderModelList()
        {
            var models = GetFilteredAndSortedModels();

            if (models.Count == 0)
            {
                ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.5f, 0.5f, 0.5f, 1));
                
                var windowSize = ImGui.GetWindowSize();
                var text = _cache.CachedModelCount == 0 
                    ? "No models loaded\n\nClick 'Load' to open IFC files" 
                    : "No models match search";
                    
                var textSize = ImGui.CalcTextSize(text);
                ImGui.SetCursorPos(new Vector2(
                    (windowSize.X - textSize.X) / 2,
                    (windowSize.Y - textSize.Y) / 2
                ));
                
                ImGui.TextWrapped(text);
                ImGui.PopStyleColor();
                return;
            }

            // Table headers
            if (ImGui.BeginTable("models", 6, ImGuiTableFlags.Borders | ImGuiTableFlags.RowBg | ImGuiTableFlags.Resizable))
            {
                ImGui.TableSetupColumn("Status", ImGuiTableColumnFlags.WidthFixed, 50);
                ImGui.TableSetupColumn("Name", ImGuiTableColumnFlags.WidthStretch);
                ImGui.TableSetupColumn("Elements", ImGuiTableColumnFlags.WidthFixed, 80);
                ImGui.TableSetupColumn("Size", ImGuiTableColumnFlags.WidthFixed, 80);
                ImGui.TableSetupColumn("Last Access", ImGuiTableColumnFlags.WidthFixed, 120);
                ImGui.TableSetupColumn("Actions", ImGuiTableColumnFlags.WidthFixed, 150);
                ImGui.TableHeadersRow();

                // Rows
                foreach (var model in models)
                {
                    ImGui.TableNextRow();

                    // Status column
                    ImGui.TableNextColumn();
                    if (model.IsCurrent)
                    {
                        ImGui.TextColored(new Vector4(0.2f, 0.8f, 0.3f, 1), "● Active");
                    }
                    else
                    {
                        ImGui.TextColored(new Vector4(0.5f, 0.5f, 0.5f, 1), "○ Cached");
                    }

                    // Name column
                    ImGui.TableNextColumn();
                    if (model.IsCurrent)
                    {
                        ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(1, 1, 1, 1));
                        ImGui.Text(model.FileName);
                        ImGui.PopStyleColor();
                    }
                    else
                    {
                        ImGui.Text(model.FileName);
                    }

                    if (ImGui.IsItemHovered())
                    {
                        ImGui.BeginTooltip();
                        ImGui.Text($"Path: {model.FilePath}");
                        ImGui.Text($"Loaded: {model.LoadedAt:yyyy-MM-dd HH:mm:ss}");
                        ImGui.Text($"Access Count: {model.AccessCount}");
                        ImGui.EndTooltip();
                    }

                    // Elements column
                    ImGui.TableNextColumn();
                    ImGui.Text($"{model.ElementCount:N0}");

                    // Size column
                    ImGui.TableNextColumn();
                    ImGui.Text(FormatBytes(model.EstimatedSize));

                    // Last Access column
                    ImGui.TableNextColumn();
                    var timeAgo = DateTime.UtcNow - model.LastAccessed;
                    ImGui.Text(FormatTimeAgo(timeAgo));

                    // Actions column
                    ImGui.TableNextColumn();

                    if (!model.IsCurrent)
                    {
                        if (ImGui.SmallButton($"Switch##{model.FileName}"))
                        {
                            _cache.SwitchTo(model.FilePath);
                        }
                        ImGui.SameLine();
                    }

                    if (ImGui.SmallButton($"Unload##{model.FileName}"))
                    {
                        _cache.Unload(model.FilePath);
                    }

                    if (!model.IsCurrent)
                    {
                        ImGui.SameLine();
                        if (ImGui.SmallButton($"Info##{model.FileName}"))
                        {
                            ImGui.OpenPopup($"info_{model.FileName}");
                        }

                        if (ImGui.BeginPopup($"info_{model.FileName}"))
                        {
                            ImGui.Text($"File: {model.FileName}");
                            ImGui.Separator();
                            ImGui.Text($"Elements: {model.ElementCount:N0}");
                            ImGui.Text($"Memory: {FormatBytes(model.EstimatedSize)}");
                            ImGui.Text($"Loaded: {model.LoadedAt:G}");
                            ImGui.Text($"Last Access: {model.LastAccessed:G}");
                            ImGui.Text($"Access Count: {model.AccessCount}");
                            ImGui.EndPopup();
                        }
                    }
                }

                ImGui.EndTable();
            }
        }

        private void RenderStatusBar()
        {
            ImGui.Separator();

            // Memory usage bar
            var memoryUsage = _cache.TotalMemoryUsage;
            var maxMemory = 2048L * 1024 * 1024; // 2GB default
            var percentage = (float)memoryUsage / maxMemory;

            ImGui.Text("Memory:");
            ImGui.SameLine();
            
            var color = percentage < 0.7f 
                ? new Vector4(0.2f, 0.8f, 0.3f, 1)
                : percentage < 0.9f 
                    ? new Vector4(0.9f, 0.7f, 0.2f, 1)
                    : new Vector4(0.9f, 0.2f, 0.2f, 1);

            ImGui.PushStyleColor(ImGuiCol.PlotHistogram, color);
            ImGui.ProgressBar(percentage, new Vector2(-1, 0), 
                $"{FormatBytes(memoryUsage)} / {FormatBytes(maxMemory)} ({percentage * 100:F1}%)");
            ImGui.PopStyleColor();
        }

        private void RenderLoadDialog()
        {
            // This would integrate with your file dialog system
            // For now, placeholder
            _showLoadDialog = false;
        }

        private List<CachedModelInfo> GetFilteredAndSortedModels()
        {
            var models = _cache.GetCachedModels();

            // Filter
            if (!string.IsNullOrWhiteSpace(_searchFilter))
            {
                var filter = _searchFilter.ToLowerInvariant();
                models = models
                    .Where(m => m.FileName.ToLowerInvariant().Contains(filter))
                    .ToList();
            }

            // Sort
            models = _sortColumn switch
            {
                SortColumn.Name => _sortDescending 
                    ? models.OrderByDescending(m => m.FileName).ToList()
                    : models.OrderBy(m => m.FileName).ToList(),
                    
                SortColumn.Size => _sortDescending
                    ? models.OrderByDescending(m => m.EstimatedSize).ToList()
                    : models.OrderBy(m => m.EstimatedSize).ToList(),
                    
                SortColumn.Elements => _sortDescending
                    ? models.OrderByDescending(m => m.ElementCount).ToList()
                    : models.OrderBy(m => m.ElementCount).ToList(),
                    
                SortColumn.LastAccessed => _sortDescending
                    ? models.OrderByDescending(m => m.LastAccessed).ToList()
                    : models.OrderBy(m => m.LastAccessed).ToList(),
                    
                _ => models
            };

            return models;
        }

        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:F1} {sizes[order]}";
        }

        private string FormatTimeAgo(TimeSpan timeAgo)
        {
            if (timeAgo.TotalSeconds < 60)
                return "Just now";
            if (timeAgo.TotalMinutes < 60)
                return $"{(int)timeAgo.TotalMinutes}m ago";
            if (timeAgo.TotalHours < 24)
                return $"{(int)timeAgo.TotalHours}h ago";
            return $"{(int)timeAgo.TotalDays}d ago";
        }

        private enum SortColumn
        {
            Name,
            Size,
            Elements,
            LastAccessed
        }
    }
}
