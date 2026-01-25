/**
 * Panels v2 - Index
 * Exporta todos os painéis especializados
 */

export { IFCPropertyPanel } from './IFCPropertyPanel';
export { ProjectExplorer, ProjectNode } from './ProjectExplorer';
export { LayersPanel, Layer } from './LayersPanel';
export { MeasurementPanel, MeasurementType, Measurement } from './MeasurementPanel';
export { TimelinePanel, TimelineTask } from './TimelinePanel';
export { SchedulePanel, ScheduleActivity, ScheduleResource } from './SchedulePanel';
export { CostDashboard, CostItem } from './CostDashboard';
export { QuantitiesPanel, Quantity } from './QuantitiesPanel';
export { FacilityPanel, FacilityAsset } from './FacilityPanel';
export { MaintenancePanel, MaintenanceTask } from './MaintenancePanel';
export { MaterialEditor, Material } from './MaterialEditor';
export { LightingPanel, Light } from './LightingPanel';
export { CameraPresetsPanel, CameraPreset } from './CameraPresetsPanel';
export { SectionBoxTool, SectionBox } from './SectionBoxTool';
export { ClippingPlanesEditor, ClippingPlane } from './ClippingPlanesEditor';
export { ExplodeViewPanel, ExplodeConfig } from './ExplodeViewPanel';
export { TransparencyControl, TransparencyRule } from './TransparencyControl';
export { ChatPanel, ChatMessage, ChatUser } from './ChatPanel';
export { AnnotationsPanel, Annotation } from './AnnotationsPanel';
export { IssuesPanel, Issue, IssueComment } from './IssuesPanel';
export { UserPresenceWidget, User } from './UserPresenceWidget';
export { ActivityFeed, Activity } from './ActivityFeed';
export { AdvancedSearchPanel, SearchQuery, SearchResult } from './AdvancedSearchPanel';
export { FilterBuilder, FilterRule, FilterGroup } from './FilterBuilder';
export { SavedFiltersPanel, SavedFilter } from './SavedFiltersPanel';
export { SelectionSetsPanel, SelectionSet } from './SelectionSetsPanel';
export { FileBrowser, FileItem } from './FileBrowser';

// Re-export design system components
export * from '../design-system/components';
