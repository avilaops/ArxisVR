//! # Arxis - Biblioteca de Matemática Avançada
//!
//! Biblioteca Rust completa para computação matemática avançada, incluindo:
//! - Quaternions para rotações 3D e 4D com suporte para grupo SO(4)
//! - Tensores generalizados (ordem 0-4) para relatividade, ML e processamento de imagens
//! - Geometria 4D com politopos regulares e projeções
//! - Física teórica: Relatividade Geral, transformações de Lorentz
//!
//! ## Estrutura dos Módulos
//!
//! - [`geometry`] - Quaternions, geometria 4D, transformações espaciais
//! - [`physics`] - Relatividade geral, transformações de Lorentz, tensores físicos
//! - [`tensor`] - Tensores generalizados, operações tensoriais, ML
//!
//! ## Exemplos
//!
//! ```rust,ignore
//! use arxis_quaternions::prelude::*;
//!
//! // Rotação 3D com quaternions
//! let q = Quat3D::from_axis_angle([0.0, 0.0, 1.0], std::f64::consts::PI / 2.0);
//! let v = q.rotate_vector([1.0, 0.0, 0.0]);
//!
//! // Geometria 4D
//! let tesseract = Tesseract::new();
//! println!("Vértices: {}", tesseract.vertices.len());
//!
//! // Tensores
//! let matrix = Matrix::zeros([3, 3]);
//! ```

pub mod geometry;
pub mod physics;
pub mod tensor;

/// Prelude com imports mais comuns
pub mod prelude {
    pub use crate::geometry::{
        Cell24, Matrix4x4, Point4D, Projection4Dto3D, RigidBody4D, Tesseract,
    };
    pub use crate::geometry::{DualQuat, Quat3D, SO4Rotation};
    pub use crate::physics::{
        BlackHoleProperties, ChristoffelSymbols, CompactBinary, CosmicStructure,
        CosmologicalObservables, CosmologicalParameters, Detector, EinsteinTensor, FLRWUniverse,
        GeodesicIntegrator, GravitationalEffects, GravitationalLens, GravitationalWave, LensType,
        LensingStatistics, LorentzTransform, MetricTensor, MicrolensingEvent, MinkowskiMetric,
        OrbitCalculator, OrbitType, ParticleState, Polarization, WaveformAnalysis, WeakLensing,
    };
    pub use crate::tensor::{Matrix, Scalar, Tensor, Tensor3D, Tensor4D, Vector};
}

// ============================================================================
// WASM Module - WebAssembly exports para ArxisVR Engine
// ============================================================================

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(start)]
pub fn wasm_init() {
    // Set panic hook para melhor debug no browser
    console_error_panic_hook::set_once();
    
    // Aloca WASM memory eficientemente
    #[cfg(feature = "wee_alloc")]
    #[global_allocator]
    static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
}

/// Testa conexão WASM
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn test_connection() -> String {
    "✅ Arxis-Core WASM connected!".to_string()
}

/// Resultado de computação física
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub struct PhysicsResult {
    position: Vec<f64>,
    velocity: Vec<f64>,
    force: Vec<f64>,
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
impl PhysicsResult {
    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Vec<f64> {
        self.position.clone()
    }
    
    #[wasm_bindgen(getter)]
    pub fn velocity(&self) -> Vec<f64> {
        self.velocity.clone()
    }
    
    #[wasm_bindgen(getter)]
    pub fn force(&self) -> Vec<f64> {
        self.force.clone()
    }
}

/// Computa física usando engine Rust
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn compute_physics(
    position: &[f64],
    velocity: &[f64],
    mass: f64,
) -> PhysicsResult {
    let dt = 0.016; // 60 FPS
    let gravity = [0.0, -9.81, 0.0];
    
    // Força gravitacional
    let force: Vec<f64> = gravity.iter().map(|g| g * mass).collect();
    
    // Aceleração
    let acceleration: Vec<f64> = force.iter().map(|f| f / mass).collect();
    
    // Nova velocidade
    let new_velocity: Vec<f64> = velocity.iter()
        .zip(acceleration.iter())
        .map(|(v, a)| v + a * dt)
        .collect();
    
    // Nova posição
    let new_position: Vec<f64> = position.iter()
        .zip(new_velocity.iter())
        .map(|(p, v)| p + v * dt)
        .collect();
    
    PhysicsResult {
        position: new_position,
        velocity: new_velocity,
        force,
    }
}





