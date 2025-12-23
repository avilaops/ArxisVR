# PIPELINE IFC → MOBILE - GUIA DE IMPLEMENTAÇÃO

> **Objetivo**: Transformar IFC bruto em geometria mobile-ready, sem perder semântica BIM.

---

## VISÃO GERAL DO PIPELINE

```
┌──────────────┐
│   IFC File   │  (ISO 16739 STEP format)
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         FASE 1: PARSING                 │
│  ┌────────────────────────────────────┐ │
│  │ 1.1 STEP Parser                    │ │
│  │ 1.2 Entity Resolution              │ │
│  │ 1.3 Graph Construction             │ │
│  └────────────────────────────────────┘ │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         FASE 2: NORMALIZAÇÃO           │
│  ┌────────────────────────────────────┐ │
│  │ 2.1 Coordinate Systems             │ │
│  │ 2.2 Unit Conversion                │ │
│  │ 2.3 Placement Resolution           │ │
│  │ 2.4 Instance Expansion             │ │
│  └────────────────────────────────────┘ │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      FASE 3: RESOLUÇÃO GEOMÉTRICA      │
│  ┌────────────────────────────────────┐ │
│  │ 3.1 Extrusões → Malhas             │ │
│  │ 3.2 Revoluções → Malhas            │ │
│  │ 3.3 CSG/Boolean → Malhas           │ │
│  │ 3.4 Openings → Malhas              │ │
│  │ 3.5 Curved Geometry → Tesselation │ │
│  └────────────────────────────────────┘ │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      FASE 4: VALIDAÇÃO TOPOLÓGICA      │
│  ┌────────────────────────────────────┐ │
│  │ 4.1 Manifold Check                 │ │
│  │ 4.2 Watertight Enforcement         │ │
│  │ 4.3 Normal Consistency             │ │
│  │ 4.4 Mesh Repair                    │ │
│  └────────────────────────────────────┘ │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         FASE 5: OTIMIZAÇÃO             │
│  ┌────────────────────────────────────┐ │
│  │ 5.1 LOD Generation                 │ │
│  │ 5.2 Instancing Detection           │ │
│  │ 5.3 Mesh Simplification            │ │
│  │ 5.4 Vertex Welding                 │ │
│  │ 5.5 Index Optimization             │ │
│  └────────────────────────────────────┘ │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         FASE 6: EXPORTAÇÃO             │
│  ┌────────────────────────────────────┐ │
│  │ 6.1 Spatial Indexing               │ │
│  │ 6.2 Material Consolidation         │ │
│  │ 6.3 Metadata Extraction            │ │
│  │ 6.4 Binary Serialization (.avxb)  │ │
│  └────────────────────────────────────┘ │
└───────────────┬─────────────────────────┘
                │
                ▼
┌──────────────────┐
│ Mobile Runtime   │  (.avxb + metadata)
└──────────────────┘
```

---

## FASE 1: PARSING

### 1.1 STEP Parser

```rust
// Estrutura básica do parser IFC STEP
pub struct IfcStepParser {
    entities: HashMap<u64, StepEntity>,
    header: IfcHeader,
}

impl IfcStepParser {
    pub fn parse_file(path: &Path) -> Result<Self, ParseError> {
        let content = std::fs::read_to_string(path)?;
        
        // 1. Parse header
        let header = Self::parse_header(&content)?;
        
        // 2. Parse entities
        let entities = Self::parse_entities(&content)?;
        
        Ok(Self { entities, header })
    }
    
    fn parse_header(content: &str) -> Result<IfcHeader, ParseError> {
        // ISO-10303-21 header parsing
        // FILE_DESCRIPTION, FILE_NAME, FILE_SCHEMA
        todo!()
    }
    
    fn parse_entities(content: &str) -> Result<HashMap<u64, StepEntity>, ParseError> {
        // Regex pattern: #(\d+)\s*=\s*(\w+)\((.*?)\);
        todo!()
    }
}

#[derive(Debug)]
pub struct StepEntity {
    pub id: u64,
    pub entity_type: String,
    pub attributes: Vec<StepValue>,
}

#[derive(Debug)]
pub enum StepValue {
    EntityRef(u64),
    String(String),
    Number(f64),
    Integer(i64),
    List(Vec<StepValue>),
    Null,
}
```

### 1.2 Entity Resolution

```rust
pub struct IfcEntityGraph {
    entities: HashMap<u64, Box<dyn IfcEntity>>,
}

impl IfcEntityGraph {
    pub fn resolve_from_step(parser: IfcStepParser) -> Result<Self, ResolveError> {
        let mut entities = HashMap::new();
        
        // Two-pass resolution:
        // Pass 1: Create entity instances
        for (id, step_entity) in &parser.entities {
            let entity = Self::create_entity(&step_entity)?;
            entities.insert(*id, entity);
        }
        
        // Pass 2: Resolve references
        for (id, entity) in &mut entities {
            entity.resolve_references(&entities)?;
        }
        
        Ok(Self { entities })
    }
    
    fn create_entity(step: &StepEntity) -> Result<Box<dyn IfcEntity>, ResolveError> {
        match step.entity_type.as_str() {
            "IFCWALL" => Ok(Box::new(IfcWall::from_step(step)?)),
            "IFCSPACE" => Ok(Box::new(IfcSpace::from_step(step)?)),
            "IFCEXTRUDEDAREASOLID" => Ok(Box::new(IfcExtrudedAreaSolid::from_step(step)?)),
            // ... todos os tipos IFC relevantes
            _ => Err(ResolveError::UnsupportedEntity(step.entity_type.clone())),
        }
    }
}
```

### 1.3 Graph Construction

```rust
pub struct IfcSpatialGraph {
    pub project: IfcProjectHandle,
    pub sites: Vec<IfcSiteHandle>,
    pub buildings: Vec<IfcBuildingHandle>,
    pub storeys: Vec<IfcBuildingStoreyHandle>,
    pub spaces: Vec<IfcSpaceHandle>,
    
    // Relational indices
    pub elements_by_storey: HashMap<IfcBuildingStoreyHandle, Vec<IfcElementHandle>>,
    pub elements_by_type: HashMap<IfcEntityType, Vec<IfcElementHandle>>,
}

impl IfcSpatialGraph {
    pub fn build(entity_graph: &IfcEntityGraph) -> Result<Self, GraphError> {
        // 1. Identify root project
        let project = entity_graph.find_single::<IfcProject>()?;
        
        // 2. Traverse spatial structure (IfcRelAggregates)
        let spatial_structure = Self::traverse_spatial(entity_graph, project)?;
        
        // 3. Build relational indices
        let indices = Self::build_indices(entity_graph)?;
        
        Ok(spatial_structure)
    }
}
```

---

## FASE 2: NORMALIZAÇÃO

### 2.1 Coordinate Systems

```rust
pub struct CoordinateNormalizer {
    // IFC pode ter múltiplos coordinate reference systems
    world_crs: Option<IfcCoordinateReferenceSystem>,
    local_placements: HashMap<u64, Mat4>,
}

impl CoordinateNormalizer {
    pub fn normalize_placement(
        &self,
        entity: &dyn IfcEntity,
    ) -> Result<Mat4, NormalizationError> {
        // Resolve IfcLocalPlacement chain
        let mut transform = Mat4::IDENTITY;
        let mut current = entity.object_placement();
        
        while let Some(placement) = current {
            let local_transform = self.placement_to_matrix(placement)?;
            transform = local_transform * transform;
            current = placement.placement_rel_to();
        }
        
        Ok(transform)
    }
    
    fn placement_to_matrix(
        &self,
        placement: &IfcLocalPlacement,
    ) -> Result<Mat4, NormalizationError> {
        let axis2placement = placement.relative_placement();
        
        match axis2placement {
            IfcAxis2Placement::Placement2D(p2d) => {
                self.axis2placement2d_to_matrix(p2d)
            }
            IfcAxis2Placement::Placement3D(p3d) => {
                self.axis2placement3d_to_matrix(p3d)
            }
        }
    }
    
    fn axis2placement3d_to_matrix(
        &self,
        p3d: &IfcAxis2Placement3D,
    ) -> Result<Mat4, NormalizationError> {
        let location = p3d.location();
        let axis = p3d.axis().unwrap_or(Vec3::Z);
        let ref_direction = p3d.ref_direction().unwrap_or(Vec3::X);
        
        // Construct orthonormal basis
        let z_axis = axis.normalize();
        let x_axis = ref_direction.normalize();
        let y_axis = z_axis.cross(x_axis).normalize();
        let x_axis = y_axis.cross(z_axis); // Re-orthogonalize
        
        Ok(Mat4::from_cols(
            x_axis.extend(0.0),
            y_axis.extend(0.0),
            z_axis.extend(0.0),
            location.extend(1.0),
        ))
    }
}
```

### 2.2 Unit Conversion

```rust
pub struct UnitConverter {
    length_scale: f64,      // meters
    angle_scale: f64,       // radians
    area_scale: f64,        // square meters
    volume_scale: f64,      // cubic meters
}

impl UnitConverter {
    pub fn from_ifc_project(project: &IfcProject) -> Result<Self, ConversionError> {
        let units = project.units_in_context();
        
        let mut length_scale = 1.0; // default: meters
        let mut angle_scale = 1.0;  // default: radians
        
        for unit_assignment in units.units() {
            match unit_assignment {
                IfcUnit::SiUnit(si_unit) => {
                    match si_unit.unit_type() {
                        IfcUnitEnum::LengthUnit => {
                            length_scale = Self::si_unit_scale(si_unit)?;
                        }
                        IfcUnitEnum::PlaneAngleUnit => {
                            angle_scale = Self::si_unit_scale(si_unit)?;
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        }
        
        Ok(Self {
            length_scale,
            angle_scale,
            area_scale: length_scale * length_scale,
            volume_scale: length_scale * length_scale * length_scale,
        })
    }
    
    fn si_unit_scale(si_unit: &IfcSiUnit) -> Result<f64, ConversionError> {
        let base_scale = match si_unit.name() {
            IfcSiUnitName::Metre => 1.0,
            IfcSiUnitName::Radian => 1.0,
            _ => return Err(ConversionError::UnsupportedUnit),
        };
        
        let prefix_scale = match si_unit.prefix() {
            Some(IfcSiPrefix::Milli) => 0.001,
            Some(IfcSiPrefix::Centi) => 0.01,
            Some(IfcSiPrefix::Deci) => 0.1,
            None => 1.0,
            _ => return Err(ConversionError::UnsupportedPrefix),
        };
        
        Ok(base_scale * prefix_scale)
    }
}
```

### 2.3 Placement Resolution

```rust
pub struct PlacementResolver {
    normalizer: CoordinateNormalizer,
    converter: UnitConverter,
    cache: HashMap<u64, Mat4>,
}

impl PlacementResolver {
    pub fn resolve_world_transform(
        &mut self,
        entity: &dyn IfcEntity,
    ) -> Result<Mat4, ResolveError> {
        let entity_id = entity.id();
        
        // Check cache
        if let Some(&cached) = self.cache.get(&entity_id) {
            return Ok(cached);
        }
        
        // Compute transform
        let local_transform = self.normalizer.normalize_placement(entity)?;
        
        // Apply unit conversion
        let scale_matrix = Mat4::from_scale(Vec3::splat(
            self.converter.length_scale as f32
        ));
        let world_transform = scale_matrix * local_transform;
        
        // Cache result
        self.cache.insert(entity_id, world_transform);
        
        Ok(world_transform)
    }
}
```

---

## FASE 3: RESOLUÇÃO GEOMÉTRICA

### 3.1 Extrusões → Malhas

```rust
pub struct ExtrusionResolver {
    tessellation_tolerance: f64,
}

impl ExtrusionResolver {
    pub fn resolve(
        &self,
        extrusion: &IfcExtrudedAreaSolid,
    ) -> Result<Mesh, GeometryError> {
        // 1. Resolve profile (2D curve)
        let profile = self.resolve_profile(extrusion.swept_area())?;
        
        // 2. Extrusion parameters
        let direction = extrusion.extruded_direction();
        let depth = extrusion.depth();
        
        // 3. Generate mesh
        let mesh = self.extrude_profile(&profile, direction, depth)?;
        
        // 4. Apply position transform
        if let Some(position) = extrusion.position() {
            let transform = self.axis2placement_to_matrix(position)?;
            mesh.transform(&transform);
        }
        
        Ok(mesh)
    }
    
    fn resolve_profile(
        &self,
        profile_def: &IfcProfileDef,
    ) -> Result<Profile2D, GeometryError> {
        match profile_def {
            IfcProfileDef::ArbitraryClosedProfileDef(arbitrary) => {
                let outer_curve = arbitrary.outer_curve();
                self.curve_to_polyline(outer_curve)
            }
            IfcProfileDef::RectangleProfileDef(rect) => {
                self.rectangle_to_polyline(rect)
            }
            IfcProfileDef::CircleProfileDef(circle) => {
                self.circle_to_polyline(circle)
            }
            IfcProfileDef::IShapeProfileDef(i_shape) => {
                self.i_shape_to_polyline(i_shape)
            }
            _ => Err(GeometryError::UnsupportedProfile),
        }
    }
    
    fn extrude_profile(
        &self,
        profile: &Profile2D,
        direction: Vec3,
        depth: f64,
    ) -> Result<Mesh, GeometryError> {
        let mut vertices = Vec::new();
        let mut indices = Vec::new();
        
        // Front face (t=0)
        for &point in &profile.points {
            vertices.push(Vertex {
                position: Vec3::new(point.x, point.y, 0.0),
                normal: -direction,
                uv: Vec2::ZERO,
            });
        }
        
        // Back face (t=depth)
        let offset = direction * depth as f32;
        for &point in &profile.points {
            vertices.push(Vertex {
                position: Vec3::new(point.x, point.y, 0.0) + offset,
                normal: direction,
                uv: Vec2::ZERO,
            });
        }
        
        let n = profile.points.len();
        
        // Side faces
        for i in 0..n {
            let i_next = (i + 1) % n;
            
            let v0 = i as u32;
            let v1 = i_next as u32;
            let v2 = (n + i) as u32;
            let v3 = (n + i_next) as u32;
            
            // Two triangles per quad
            indices.push(v0);
            indices.push(v1);
            indices.push(v2);
            
            indices.push(v1);
            indices.push(v3);
            indices.push(v2);
        }
        
        // Triangulate front and back faces
        let front_tris = triangulate_polygon(&profile.points)?;
        for tri in front_tris {
            indices.extend_from_slice(&tri);
        }
        
        let back_tris = triangulate_polygon(&profile.points)?;
        for tri in back_tris {
            indices.push(tri[0] + n as u32);
            indices.push(tri[2] + n as u32); // Reversed winding
            indices.push(tri[1] + n as u32);
        }
        
        Ok(Mesh { vertices, indices })
    }
}
```

### 3.2 Revoluções → Malhas

```rust
pub struct RevolutionResolver {
    segments_per_revolution: usize,
}

impl RevolutionResolver {
    pub fn resolve(
        &self,
        revolution: &IfcRevolvedAreaSolid,
    ) -> Result<Mesh, GeometryError> {
        let profile = self.resolve_profile(revolution.swept_area())?;
        let axis = revolution.axis();
        let angle = revolution.angle(); // radians
        
        self.revolve_profile(&profile, axis, angle)
    }
    
    fn revolve_profile(
        &self,
        profile: &Profile2D,
        axis: &IfcAxis1Placement,
        angle: f64,
    ) -> Result<Mesh, GeometryError> {
        let axis_origin = axis.location();
        let axis_direction = axis.axis().unwrap_or(Vec3::Z);
        
        let segments = ((angle / (2.0 * PI)) * self.segments_per_revolution as f64).ceil() as usize;
        let angle_step = angle / segments as f64;
        
        let mut vertices = Vec::new();
        let mut indices = Vec::new();
        
        // Generate rings
        for seg in 0..=segments {
            let theta = seg as f64 * angle_step;
            let rot = Quat::from_axis_angle(axis_direction, theta as f32);
            
            for &point in &profile.points {
                let p3d = Vec3::new(point.x, point.y, 0.0);
                let rotated = rot * (p3d - axis_origin) + axis_origin;
                
                vertices.push(Vertex {
                    position: rotated,
                    normal: Vec3::ZERO, // Computed later
                    uv: Vec2::ZERO,
                });
            }
        }
        
        // Connect rings
        let n_points = profile.points.len();
        for seg in 0..segments {
            for i in 0..n_points {
                let i_next = (i + 1) % n_points;
                
                let v0 = (seg * n_points + i) as u32;
                let v1 = (seg * n_points + i_next) as u32;
                let v2 = ((seg + 1) * n_points + i) as u32;
                let v3 = ((seg + 1) * n_points + i_next) as u32;
                
                indices.push(v0);
                indices.push(v1);
                indices.push(v2);
                
                indices.push(v1);
                indices.push(v3);
                indices.push(v2);
            }
        }
        
        let mut mesh = Mesh { vertices, indices };
        mesh.compute_normals();
        
        Ok(mesh)
    }
}
```

### 3.3 CSG/Boolean → Malhas

```rust
pub struct BooleanResolver {
    bsp_builder: BspTreeBuilder,
}

impl BooleanResolver {
    pub fn resolve_boolean_clipping(
        &self,
        operand: &IfcBooleanClippingResult,
    ) -> Result<Mesh, GeometryError> {
        // IFC boolean structure:
        // - FirstOperand: IfcSolidModel
        // - SecondOperand: IfcHalfSpaceSolid
        // - Operator: DIFFERENCE (typically)
        
        let first_operand = self.resolve_solid_model(operand.first_operand())?;
        let second_operand = self.resolve_half_space(operand.second_operand())?;
        
        match operand.operator() {
            IfcBooleanOperator::Difference => {
                self.boolean_difference(&first_operand, &second_operand)
            }
            IfcBooleanOperator::Union => {
                self.boolean_union(&first_operand, &second_operand)
            }
            IfcBooleanOperator::Intersection => {
                self.boolean_intersection(&first_operand, &second_operand)
            }
        }
    }
    
    fn boolean_difference(
        &self,
        mesh_a: &Mesh,
        mesh_b: &Mesh,
    ) -> Result<Mesh, GeometryError> {
        // Build BSP trees
        let tree_a = self.bsp_builder.build_from_mesh(mesh_a)?;
        let tree_b = self.bsp_builder.build_from_mesh(mesh_b)?;
        
        // A - B operation
        let result_tree = tree_a.subtract(&tree_b);
        
        // Convert back to mesh
        Ok(result_tree.to_mesh())
    }
    
    fn resolve_half_space(
        &self,
        half_space: &IfcHalfSpaceSolid,
    ) -> Result<Mesh, GeometryError> {
        // Half-space is infinite, so we create a large box
        // clipped by the half-space plane
        
        let base_surface = half_space.base_surface();
        let plane = self.surface_to_plane(base_surface)?;
        let agreement = half_space.agreement_flag();
        
        // Create large box
        let bbox_size = 1000.0; // meters (adaptive based on context)
        let box_mesh = Mesh::create_box(Vec3::splat(bbox_size));
        
        // Clip by plane
        self.clip_mesh_by_plane(&box_mesh, &plane, agreement)
    }
}
```

### 3.4 Openings → Malhas

```rust
pub struct OpeningResolver {
    boolean_resolver: BooleanResolver,
}

impl OpeningResolver {
    pub fn apply_opening(
        &self,
        element_mesh: &Mesh,
        opening: &IfcOpeningElement,
    ) -> Result<Mesh, GeometryError> {
        // 1. Resolve opening geometry
        let opening_mesh = self.resolve_opening_geometry(opening)?;
        
        // 2. Apply boolean difference
        self.boolean_resolver.boolean_difference(element_mesh, &opening_mesh)
    }
    
    fn resolve_opening_geometry(
        &self,
        opening: &IfcOpeningElement,
    ) -> Result<Mesh, GeometryError> {
        let representation = opening.representation()?;
        let shape = representation.representations().first()?;
        
        // Typically IfcExtrudedAreaSolid
        match shape.items().first()? {
            IfcRepresentationItem::ExtrudedAreaSolid(extrusion) => {
                ExtrusionResolver::default().resolve(extrusion)
            }
            _ => Err(GeometryError::UnsupportedOpeningType),
        }
    }
}
```

### 3.5 Curved Geometry → Tessellation

```rust
pub struct CurveTessellator {
    pub tolerance: f64, // Maximum distance from ideal curve
    pub max_segments: usize,
}

impl CurveTessellator {
    pub fn tessellate_circle(&self, radius: f64) -> Vec<Vec2> {
        let segments = self.compute_circle_segments(radius);
        
        (0..segments)
            .map(|i| {
                let theta = (i as f64 / segments as f64) * 2.0 * PI;
                Vec2::new(
                    (radius * theta.cos()) as f32,
                    (radius * theta.sin()) as f32,
                )
            })
            .collect()
    }
    
    fn compute_circle_segments(&self, radius: f64) -> usize {
        // Adaptive tessellation based on tolerance
        // Formula: n = ceil(2π / acos(1 - tolerance/radius))
        
        let angle_increment = 2.0 * (1.0 - self.tolerance / radius).acos();
        let segments = (2.0 * PI / angle_increment).ceil() as usize;
        
        segments.clamp(8, self.max_segments)
    }
    
    pub fn tessellate_bspline_curve(
        &self,
        curve: &IfcBSplineCurve,
    ) -> Result<Vec<Vec3>, GeometryError> {
        let degree = curve.degree();
        let control_points = curve.control_points_list();
        let knots = curve.knot_multiplicities();
        
        // Evaluate curve at parameter samples
        let num_samples = self.compute_curve_samples(control_points.len());
        
        (0..num_samples)
            .map(|i| {
                let t = i as f64 / (num_samples - 1) as f64;
                self.evaluate_bspline(t, degree, control_points, knots)
            })
            .collect()
    }
    
    fn evaluate_bspline(
        &self,
        t: f64,
        degree: usize,
        control_points: &[Vec3],
        knots: &[f64],
    ) -> Result<Vec3, GeometryError> {
        // De Boor's algorithm
        todo!("Implement B-spline evaluation")
    }
}
```

---

## FASE 4: VALIDAÇÃO TOPOLÓGICA

### 4.1 Manifold Check

```rust
pub struct ManifoldChecker;

impl ManifoldChecker {
    pub fn check(mesh: &Mesh) -> ManifoldStatus {
        let edge_usage = Self::count_edge_usage(mesh);
        
        let mut non_manifold_edges = Vec::new();
        let mut boundary_edges = Vec::new();
        
        for (edge, &count) in &edge_usage {
            match count {
                1 => boundary_edges.push(*edge),
                2 => {}, // Manifold edge
                _ => non_manifold_edges.push(*edge),
            }
        }
        
        if non_manifold_edges.is_empty() {
            if boundary_edges.is_empty() {
                ManifoldStatus::Closed
            } else {
                ManifoldStatus::OpenManifold {
                    boundary_edges: boundary_edges.len(),
                }
            }
        } else {
            ManifoldStatus::NonManifold {
                problematic_edges: non_manifold_edges,
            }
        }
    }
    
    fn count_edge_usage(mesh: &Mesh) -> HashMap<Edge, usize> {
        let mut edge_usage = HashMap::new();
        
        for triangle in mesh.indices.chunks(3) {
            let v0 = triangle[0];
            let v1 = triangle[1];
            let v2 = triangle[2];
            
            // Three edges per triangle
            *edge_usage.entry(Edge::new(v0, v1)).or_insert(0) += 1;
            *edge_usage.entry(Edge::new(v1, v2)).or_insert(0) += 1;
            *edge_usage.entry(Edge::new(v2, v0)).or_insert(0) += 1;
        }
        
        edge_usage
    }
}

#[derive(Debug, Clone, Copy, Hash, PartialEq, Eq)]
struct Edge {
    v0: u32,
    v1: u32,
}

impl Edge {
    fn new(a: u32, b: u32) -> Self {
        // Canonical ordering
        if a < b {
            Self { v0: a, v1: b }
        } else {
            Self { v0: b, v1: a }
        }
    }
}

#[derive(Debug)]
pub enum ManifoldStatus {
    Closed,
    OpenManifold { boundary_edges: usize },
    NonManifold { problematic_edges: Vec<Edge> },
}
```

### 4.2 Watertight Enforcement

```rust
pub struct WatertightEnforcer {
    weld_tolerance: f64,
}

impl WatertightEnforcer {
    pub fn enforce(&self, mesh: &mut Mesh) -> Result<(), EnforcementError> {
        // 1. Weld nearby vertices
        self.weld_vertices(mesh)?;
        
        // 2. Fill holes
        self.fill_holes(mesh)?;
        
        // 3. Verify
        let status = ManifoldChecker::check(mesh);
        match status {
            ManifoldStatus::Closed => Ok(()),
            _ => Err(EnforcementError::CannotMakeWatertight),
        }
    }
    
    fn weld_vertices(&self, mesh: &mut Mesh) -> Result<(), EnforcementError> {
        let spatial_hash = self.build_spatial_hash(&mesh.vertices);
        let mut remap = vec![None; mesh.vertices.len()];
        
        for (i, vertex) in mesh.vertices.iter().enumerate() {
            if remap[i].is_some() {
                continue;
            }
            
            let nearby = spatial_hash.query_sphere(vertex.position, self.weld_tolerance);
            
            for &j in &nearby {
                if j != i && remap[j].is_none() {
                    remap[j] = Some(i as u32);
                }
            }
        }
        
        // Remap indices
        for index in &mut mesh.indices {
            while let Some(new_index) = remap[*index as usize] {
                *index = new_index;
            }
        }
        
        // Remove unused vertices
        mesh.compact();
        
        Ok(())
    }
    
    fn fill_holes(&self, mesh: &mut Mesh) -> Result<(), EnforcementError> {
        let boundary_loops = self.find_boundary_loops(mesh);
        
        for loop_edges in boundary_loops {
            if loop_edges.len() < 3 {
                continue; // Cannot fill
            }
            
            // Triangulate hole
            let hole_vertices: Vec<u32> = loop_edges.iter()
                .map(|edge| edge.v0)
                .collect();
            
            let triangles = self.triangulate_hole(&hole_vertices, mesh)?;
            mesh.indices.extend_from_slice(&triangles);
        }
        
        Ok(())
    }
    
    fn find_boundary_loops(&self, mesh: &Mesh) -> Vec<Vec<Edge>> {
        let edge_usage = ManifoldChecker::count_edge_usage(mesh);
        
        let boundary_edges: Vec<Edge> = edge_usage.iter()
            .filter(|(_, &count)| count == 1)
            .map(|(edge, _)| *edge)
            .collect();
        
        // Connect edges into loops
        Self::connect_edges_to_loops(boundary_edges)
    }
}
```

### 4.3 Normal Consistency

```rust
pub struct NormalConsistencyEnforcer;

impl NormalConsistencyEnforcer {
    pub fn enforce(mesh: &mut Mesh) -> Result<(), ConsistencyError> {
        // 1. Build connectivity
        let connectivity = Self::build_connectivity(mesh);
        
        // 2. Orient triangles consistently
        let mut visited = vec![false; mesh.indices.len() / 3];
        let mut stack = vec![0usize]; // Start from first triangle
        
        while let Some(tri_idx) = stack.pop() {
            if visited[tri_idx] {
                continue;
            }
            visited[tri_idx] = true;
            
            let neighbors = connectivity.neighbors(tri_idx);
            
            for (neighbor_idx, shared_edge) in neighbors {
                if visited[neighbor_idx] {
                    continue;
                }
                
                // Check if neighbor has consistent winding
                if !Self::has_consistent_winding(mesh, tri_idx, neighbor_idx, shared_edge) {
                    // Flip neighbor
                    Self::flip_triangle(mesh, neighbor_idx);
                }
                
                stack.push(neighbor_idx);
            }
        }
        
        // 3. Recompute normals
        mesh.compute_normals();
        
        Ok(())
    }
    
    fn has_consistent_winding(
        mesh: &Mesh,
        tri_a: usize,
        tri_b: usize,
        shared_edge: Edge,
    ) -> bool {
        let tri_a_indices = &mesh.indices[tri_a * 3..(tri_a + 1) * 3];
        let tri_b_indices = &mesh.indices[tri_b * 3..(tri_b + 1) * 3];
        
        // Edge in tri_a should be reversed in tri_b
        let edge_in_a = Self::find_edge_direction(tri_a_indices, shared_edge);
        let edge_in_b = Self::find_edge_direction(tri_b_indices, shared_edge);
        
        edge_in_a != edge_in_b
    }
    
    fn flip_triangle(mesh: &mut Mesh, tri_idx: usize) {
        let base = tri_idx * 3;
        mesh.indices.swap(base + 1, base + 2);
    }
}
```

### 4.4 Mesh Repair

```rust
pub struct MeshRepairer {
    watertight_enforcer: WatertightEnforcer,
    normal_enforcer: NormalConsistencyEnforcer,
}

impl MeshRepairer {
    pub fn repair(&self, mesh: &mut Mesh) -> RepairReport {
        let mut report = RepairReport::default();
        
        // 1. Remove degenerate triangles
        report.degenerate_removed = self.remove_degenerate_triangles(mesh);
        
        // 2. Remove duplicate vertices
        report.duplicates_merged = self.merge_duplicate_vertices(mesh);
        
        // 3. Remove unused vertices
        mesh.compact();
        
        // 4. Enforce manifold
        if let Err(e) = self.watertight_enforcer.enforce(mesh) {
            report.watertight_enforcement_failed = true;
        }
        
        // 5. Consistent normals
        if let Err(e) = NormalConsistencyEnforcer::enforce(mesh) {
            report.normal_consistency_failed = true;
        }
        
        report
    }
    
    fn remove_degenerate_triangles(&self, mesh: &mut Mesh) -> usize {
        let epsilon = 1e-6;
        let mut removed = 0;
        
        mesh.indices.retain(|chunk| {
            let v0 = mesh.vertices[chunk[0] as usize].position;
            let v1 = mesh.vertices[chunk[1] as usize].position;
            let v2 = mesh.vertices[chunk[2] as usize].position;
            
            let area = (v1 - v0).cross(v2 - v0).length();
            
            if area < epsilon {
                removed += 1;
                false
            } else {
                true
            }
        });
        
        removed
    }
}

#[derive(Debug, Default)]
pub struct RepairReport {
    pub degenerate_removed: usize,
    pub duplicates_merged: usize,
    pub watertight_enforcement_failed: bool,
    pub normal_consistency_failed: bool,
}
```

---

## FASE 5: OTIMIZAÇÃO

### 5.1 LOD Generation

```rust
pub struct LodGenerator {
    simplifier: MeshSimplifier,
}

impl LodGenerator {
    pub fn generate_lods(&self, mesh: &Mesh) -> Vec<Mesh> {
        vec![
            mesh.clone(),                                    // LOD 0: full detail
            self.simplifier.simplify(mesh, 0.75),            // LOD 1: 75%
            self.simplifier.simplify(mesh, 0.50),            // LOD 2: 50%
            self.simplifier.simplify(mesh, 0.25),            // LOD 3: 25%
            self.simplifier.simplify(mesh, 0.10),            // LOD 4: 10%
            Self::create_bounding_box_mesh(&mesh.bounds()),  // LOD 5: bbox
        ]
    }
    
    fn create_bounding_box_mesh(aabb: &AABB) -> Mesh {
        Mesh::create_box(aabb.size())
            .transform(&Mat4::from_translation(aabb.center()))
    }
}
```

### 5.2 Instancing Detection

```rust
pub struct InstancingDetector {
    similarity_threshold: f64,
}

impl InstancingDetector {
    pub fn detect_instances(
        &self,
        objects: &[RuntimeSolid],
    ) -> Vec<InstanceGroup> {
        let mut groups = Vec::new();
        let mut assigned = vec![false; objects.len()];
        
        for i in 0..objects.len() {
            if assigned[i] {
                continue;
            }
            
            let mut group = InstanceGroup {
                prototype_index: i,
                instances: vec![InstanceTransform {
                    index: i,
                    transform: objects[i].local_to_world,
                }],
            };
            
            for j in (i + 1)..objects.len() {
                if assigned[j] {
                    continue;
                }
                
                if self.are_geometrically_similar(&objects[i], &objects[j]) {
                    group.instances.push(InstanceTransform {
                        index: j,
                        transform: objects[j].local_to_world,
                    });
                    assigned[j] = true;
                }
            }
            
            if group.instances.len() > 1 {
                groups.push(group);
            }
            
            assigned[i] = true;
        }
        
        groups
    }
    
    fn are_geometrically_similar(
        &self,
        obj_a: &RuntimeSolid,
        obj_b: &RuntimeSolid,
    ) -> bool {
        // 1. Same vertex count
        if obj_a.vertices.len() != obj_b.vertices.len() {
            return false;
        }
        
        // 2. Same index count
        if obj_a.indices.len() != obj_b.indices.len() {
            return false;
        }
        
        // 3. Geometric similarity (after removing transform)
        let similarity = self.compute_geometric_similarity(obj_a, obj_b);
        
        similarity > self.similarity_threshold
    }
    
    fn compute_geometric_similarity(
        &self,
        obj_a: &RuntimeSolid,
        obj_b: &RuntimeSolid,
    ) -> f64 {
        // Compare local-space geometry (transform-invariant)
        let inv_a = obj_a.local_to_world.inverse();
        let inv_b = obj_b.local_to_world.inverse();
        
        let mut total_distance = 0.0;
        
        for i in 0..obj_a.vertices.len() {
            let pos_a = inv_a.transform_point3(obj_a.vertices[i].position);
            let pos_b = inv_b.transform_point3(obj_b.vertices[i].position);
            
            total_distance += pos_a.distance(pos_b) as f64;
        }
        
        let avg_distance = total_distance / obj_a.vertices.len() as f64;
        let bbox_size = obj_a.aabb_local.size().length() as f64;
        
        1.0 - (avg_distance / bbox_size).min(1.0)
    }
}

#[derive(Debug)]
pub struct InstanceGroup {
    pub prototype_index: usize,
    pub instances: Vec<InstanceTransform>,
}

#[derive(Debug)]
pub struct InstanceTransform {
    pub index: usize,
    pub transform: Mat4,
}
```

### 5.3 Mesh Simplification (QEM)

```rust
pub struct MeshSimplifier {
    // Quadric Error Metrics
}

impl MeshSimplifier {
    pub fn simplify(&self, mesh: &Mesh, target_ratio: f64) -> Mesh {
        let target_triangle_count = ((mesh.indices.len() / 3) as f64 * target_ratio) as usize;
        
        // 1. Compute quadrics for each vertex
        let quadrics = self.compute_vertex_quadrics(mesh);
        
        // 2. Build edge collapse heap (sorted by error)
        let mut heap = self.build_collapse_heap(mesh, &quadrics);
        
        // 3. Collapse edges until target reached
        let mut working_mesh = mesh.clone();
        
        while working_mesh.triangle_count() > target_triangle_count {
            if let Some(collapse) = heap.pop() {
                self.collapse_edge(&mut working_mesh, collapse, &mut heap);
            } else {
                break; // No more valid collapses
            }
        }
        
        working_mesh.compact();
        working_mesh
    }
    
    fn compute_vertex_quadrics(&self, mesh: &Mesh) -> Vec<QuadricMatrix> {
        let mut quadrics = vec![QuadricMatrix::zero(); mesh.vertices.len()];
        
        for triangle in mesh.indices.chunks(3) {
            let v0 = mesh.vertices[triangle[0] as usize].position;
            let v1 = mesh.vertices[triangle[1] as usize].position;
            let v2 = mesh.vertices[triangle[2] as usize].position;
            
            // Compute plane equation
            let normal = (v1 - v0).cross(v2 - v0).normalize();
            let d = -normal.dot(v0);
            
            let plane_quadric = QuadricMatrix::from_plane(normal, d);
            
            // Add to each vertex
            quadrics[triangle[0] as usize] += plane_quadric;
            quadrics[triangle[1] as usize] += plane_quadric;
            quadrics[triangle[2] as usize] += plane_quadric;
        }
        
        quadrics
    }
}

#[derive(Clone, Copy)]
struct QuadricMatrix {
    // Symmetric 4x4 matrix stored as 10 values
    a: [f64; 10],
}

impl QuadricMatrix {
    fn from_plane(normal: Vec3, d: f32) -> Self {
        let a = normal.x as f64;
        let b = normal.y as f64;
        let c = normal.z as f64;
        let d = d as f64;
        
        Self {
            a: [
                a*a, a*b, a*c, a*d,
                     b*b, b*c, b*d,
                          c*c, c*d,
                               d*d,
            ],
        }
    }
    
    fn error(&self, v: Vec3) -> f64 {
        let x = v.x as f64;
        let y = v.y as f64;
        let z = v.z as f64;
        
        // Q(v) = [x y z 1] * Q * [x y z 1]^T
        todo!("Compute quadric error")
    }
}
```

### 5.4 Vertex Welding

```rust
pub struct VertexWelder {
    spatial_hash: SpatialHash,
    tolerance: f64,
}

impl VertexWelder {
    pub fn weld(&self, mesh: &mut Mesh) -> usize {
        let mut welded_count = 0;
        let mut remap = HashMap::new();
        
        for (i, vertex) in mesh.vertices.iter().enumerate() {
            if remap.contains_key(&i) {
                continue;
            }
            
            let nearby = self.spatial_hash.query_sphere(
                vertex.position,
                self.tolerance,
            );
            
            for &j in &nearby {
                if j > i && !remap.contains_key(&j) {
                    if self.vertices_similar(&mesh.vertices[i], &mesh.vertices[j]) {
                        remap.insert(j, i as u32);
                        welded_count += 1;
                    }
                }
            }
        }
        
        // Remap indices
        for index in &mut mesh.indices {
            if let Some(&new_index) = remap.get(&(*index as usize)) {
                *index = new_index;
            }
        }
        
        welded_count
    }
    
    fn vertices_similar(&self, v0: &Vertex, v1: &Vertex) -> bool {
        v0.position.distance(v1.position) < self.tolerance as f32
            && v0.normal.dot(v1.normal) > 0.9 // Similar normals
    }
}
```

### 5.5 Index Optimization

```rust
pub struct IndexOptimizer;

impl IndexOptimizer {
    pub fn optimize_for_vertex_cache(indices: &mut [u32]) {
        // Tom Forsyth's algorithm
        // Reorder triangles to maximize vertex cache hit rate
        
        let vertex_score_cache_decay_power = 1.5;
        let vertex_score_last_tri_score = 0.75;
        let cache_size = 32;
        
        // Implementation of vertex cache optimization
        todo!("Implement Forsyth algorithm")
    }
    
    pub fn optimize_overdraw(
        indices: &mut [u32],
        vertices: &[Vertex],
    ) {
        // Reorder triangles to minimize overdraw
        // Sort front-to-back based on centroid Z
        
        let mut triangles: Vec<_> = indices.chunks_exact_mut(3)
            .map(|tri| {
                let v0 = vertices[tri[0] as usize].position;
                let v1 = vertices[tri[1] as usize].position;
                let v2 = vertices[tri[2] as usize].position;
                
                let centroid_z = (v0.z + v1.z + v2.z) / 3.0;
                (centroid_z, [tri[0], tri[1], tri[2]])
            })
            .collect();
        
        triangles.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap());
        
        for (i, (_, tri)) in triangles.iter().enumerate() {
            indices[i * 3] = tri[0];
            indices[i * 3 + 1] = tri[1];
            indices[i * 3 + 2] = tri[2];
        }
    }
}
```

---

## FASE 6: EXPORTAÇÃO

### 6.1 Spatial Indexing

```rust
pub struct SpatialIndexBuilder {
    max_depth: usize,
}

impl SpatialIndexBuilder {
    pub fn build_bvh(&self, objects: &[RuntimeSolid]) -> BVHNode {
        self.build_bvh_recursive(objects, 0)
    }
    
    fn build_bvh_recursive(
        &self,
        objects: &[RuntimeSolid],
        depth: usize,
    ) -> BVHNode {
        if objects.len() <= 4 || depth >= self.max_depth {
            // Leaf node
            return BVHNode::Leaf {
                bounds: Self::compute_bounds(objects),
                objects: objects.iter().map(|o| o.ifc_guid.clone()).collect(),
            };
        }
        
        // Choose split axis (longest axis)
        let bounds = Self::compute_bounds(objects);
        let size = bounds.size();
        let split_axis = if size.x > size.y && size.x > size.z {
            0
        } else if size.y > size.z {
            1
        } else {
            2
        };
        
        // Sort by centroid along split axis
        let mut sorted_objects = objects.to_vec();
        sorted_objects.sort_by(|a, b| {
            let centroid_a = a.aabb_world.center()[split_axis];
            let centroid_b = b.aabb_world.center()[split_axis];
            centroid_a.partial_cmp(&centroid_b).unwrap()
        });
        
        // Split in half
        let mid = sorted_objects.len() / 2;
        let left_objects = &sorted_objects[..mid];
        let right_objects = &sorted_objects[mid..];
        
        BVHNode::Node {
            bounds,
            left: Box::new(self.build_bvh_recursive(left_objects, depth + 1)),
            right: Box::new(self.build_bvh_recursive(right_objects, depth + 1)),
        }
    }
    
    fn compute_bounds(objects: &[RuntimeSolid]) -> AABB {
        objects.iter()
            .map(|o| o.aabb_world)
            .fold(AABB::empty(), |acc, aabb| acc.union(&aabb))
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub enum BVHNode {
    Leaf {
        bounds: AABB,
        objects: Vec<String>, // IFC GUIDs
    },
    Node {
        bounds: AABB,
        left: Box<BVHNode>,
        right: Box<BVHNode>,
    },
}
```

### 6.2 Material Consolidation

```rust
pub struct MaterialConsolidator;

impl MaterialConsolidator {
    pub fn consolidate(
        objects: &[RuntimeSolid],
    ) -> (Vec<Material>, Vec<u32>) {
        let mut unique_materials = Vec::new();
        let mut material_indices = Vec::new();
        let mut material_map = HashMap::new();
        
        for object in objects {
            let material = &object.material;
            
            let material_index = if let Some(&index) = material_map.get(material) {
                index
            } else {
                let index = unique_materials.len() as u32;
                unique_materials.push(material.clone());
                material_map.insert(material.clone(), index);
                index
            };
            
            material_indices.push(material_index);
        }
        
        (unique_materials, material_indices)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct Material {
    pub diffuse_color: [u8; 4],
    pub roughness: u8,
    pub metallic: u8,
    pub texture_index: Option<u32>,
}
```

### 6.3 Metadata Extraction

```rust
pub struct MetadataExtractor;

impl MetadataExtractor {
    pub fn extract(entity: &dyn IfcEntity) -> RuntimeMetadata {
        RuntimeMetadata {
            ifc_guid: entity.global_id().to_string(),
            ifc_type: entity.entity_type(),
            name: entity.name().map(|s| s.to_string()),
            description: entity.description().map(|s| s.to_string()),
            properties: Self::extract_property_sets(entity),
            spatial_context: Self::extract_spatial_context(entity),
        }
    }
    
    fn extract_property_sets(entity: &dyn IfcEntity) -> Vec<PropertySet> {
        entity.is_defined_by()
            .iter()
            .filter_map(|rel| {
                if let IfcRelDefines::IfcRelDefinesByProperties(rel_props) = rel {
                    if let IfcPropertySetDefinition::PropertySet(pset) = rel_props.relating_property_definition() {
                        Some(Self::extract_property_set(pset))
                    } else {
                        None
                    }
                } else {
                    None
                }
            })
            .collect()
    }
    
    fn extract_property_set(pset: &IfcPropertySet) -> PropertySet {
        PropertySet {
            name: pset.name().to_string(),
            properties: pset.has_properties()
                .iter()
                .filter_map(|prop| Self::extract_property(prop))
                .collect(),
        }
    }
    
    fn extract_property(prop: &IfcProperty) -> Option<Property> {
        match prop {
            IfcProperty::SingleValue(single) => {
                Some(Property {
                    name: single.name().to_string(),
                    value: Self::extract_value(single.nominal_value()?),
                })
            }
            _ => None,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RuntimeMetadata {
    pub ifc_guid: String,
    pub ifc_type: IfcEntityType,
    pub name: Option<String>,
    pub description: Option<String>,
    pub properties: Vec<PropertySet>,
    pub spatial_context: SpatialContext,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PropertySet {
    pub name: String,
    pub properties: Vec<Property>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Property {
    pub name: String,
    pub value: PropertyValue,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum PropertyValue {
    String(String),
    Number(f64),
    Boolean(bool),
    Integer(i64),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpatialContext {
    pub building: Option<String>,
    pub storey: Option<String>,
    pub storey_elevation: Option<f32>,
    pub space: Option<String>,
}
```

### 6.4 Binary Serialization (.avxb)

```rust
use bincode;

#[derive(Serialize, Deserialize)]
pub struct AvxbFile {
    pub header: AvxbHeader,
    pub materials: Vec<Material>,
    pub objects: Vec<AvxbObject>,
    pub spatial_index: BVHNode,
    pub metadata: Vec<RuntimeMetadata>,
}

#[derive(Serialize, Deserialize)]
pub struct AvxbHeader {
    pub magic: [u8; 4],        // b"AVXB"
    pub version: u32,          // 1
    pub flags: u32,            // Feature flags
    pub num_objects: u32,
    pub num_materials: u32,
    pub bounds: AABB,
}

#[derive(Serialize, Deserialize)]
pub struct AvxbObject {
    pub guid: String,
    pub ifc_type: IfcEntityType,
    pub lod_level: u8,
    pub material_index: u32,
    pub transform: [f32; 16],
    pub aabb: [f32; 6],
    
    // Compressed geometry
    pub vertex_data: Vec<u8>,  // Compressed with Draco/Meshopt
    pub index_data: Vec<u8>,
}

impl AvxbFile {
    pub fn save(&self, path: &Path) -> Result<(), std::io::Error> {
        let encoded = bincode::serialize(self)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;
        
        std::fs::write(path, encoded)
    }
    
    pub fn load(path: &Path) -> Result<Self, std::io::Error> {
        let data = std::fs::read(path)?;
        
        bincode::deserialize(&data)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))
    }
}
```

---

## RESUMO DO PIPELINE COMPLETO

### Inputs
- **IFC File** (`.ifc` STEP format)
- **Configuration**:
  - Tessellation tolerance
  - LOD target ratios
  - Instancing similarity threshold
  - Compression level

### Outputs
- **AVXB File** (`.avxb` binary)
  - Compressed geometry
  - Spatial index (BVH)
  - Materials
  - Metadata
- **Statistics Report**:
  - Triangle counts per LOD
  - Instance groups detected
  - Compression ratio
  - Validation warnings

### Performance Targets
- **Medium building** (1000 elements):
  - Processing time: < 5 minutes
  - Output size: < 50 MB
  
- **Large building** (10,000 elements):
  - Processing time: < 30 minutes
  - Output size: < 500 MB

### Validation Checkpoints
✅ After parsing: Entity graph completeness  
✅ After normalization: Coordinate consistency  
✅ After geometry resolution: Manifold status  
✅ After optimization: Triangle count targets  
✅ Before export: Spatial index integrity  

---

**Documento mantido por**: Vizzio Core Team  
**Última atualização**: 2025-12-18  
**Status**: 🟡 Definição completa (implementação pendente)
