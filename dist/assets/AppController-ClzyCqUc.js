const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DbWvsKsa.js","assets/index-cztMRoz9.css","assets/index-DeyKvnV-.js","assets/index-i17IXJTz.js"])))=>i.map(i=>d[i]);
import { g as j, h as V, F, b as M, G as $, L as G, i as H, j as W, P as z, a as l, e as a, E as r, T as m, k as B, M as D, O as X, B as J, l as Y, m as Q, o as K, p as f, q as w, V as I, r as P, _ as A, R as b, __tla as __tla_0 } from "./index-DbWvsKsa.js";
let _, E;
let __tla = Promise.all([
    (()=>{
        try {
            return __tla_0;
        } catch  {}
    })()
]).then(async ()=>{
    var y = ((s)=>(s.Object3D = "Object3D", s.Mesh = "Mesh", s.Group = "Group", s.Light = "Light", s.Camera = "Camera", s.Line = "Line", s.Points = "Points", s))(y || {});
    class R {
        constructor(e){
            this.native = e;
        }
        get x() {
            return this.native.x;
        }
        set x(e) {
            this.native.x = e;
        }
        get y() {
            return this.native.y;
        }
        set y(e) {
            this.native.y = e;
        }
        get z() {
            return this.native.z;
        }
        set z(e) {
            this.native.z = e;
        }
        set(e, t, o) {
            this.native.set(e, t, o);
        }
        clone() {
            return new R(this.native.clone());
        }
        copy(e) {
            this.native.copy(e.native);
        }
        add(e) {
            return this.native.add(e.native), this;
        }
        sub(e) {
            return this.native.sub(e.native), this;
        }
        multiply(e) {
            return this.native.multiply(e.native), this;
        }
        multiplyScalar(e) {
            return this.native.multiplyScalar(e), this;
        }
        normalize() {
            return this.native.normalize(), this;
        }
        length() {
            return this.native.length();
        }
        distanceTo(e) {
            return this.native.distanceTo(e.native);
        }
        toArray() {
            return this.native.toArray();
        }
    }
    class x {
        constructor(e){
            this.native = e;
        }
        get x() {
            return this.native.x;
        }
        set x(e) {
            this.native.x = e;
        }
        get y() {
            return this.native.y;
        }
        set y(e) {
            this.native.y = e;
        }
        get z() {
            return this.native.z;
        }
        set z(e) {
            this.native.z = e;
        }
        get order() {
            return this.native.order;
        }
        set order(e) {
            this.native.order = e;
        }
        set(e, t, o, i) {
            this.native.set(e, t, o, i);
        }
        clone() {
            return new x(this.native.clone());
        }
        copy(e) {
            this.native.copy(e.native);
        }
        toArray() {
            return [
                this.native.x,
                this.native.y,
                this.native.z
            ];
        }
    }
    class q {
        scene;
        constructor(){
            this.scene = new j;
        }
        add(e) {
            this.scene.add(e.getNativeObject());
        }
        remove(e) {
            this.scene.remove(e.getNativeObject());
        }
        traverse(e) {
            this.scene.traverse((t)=>{
                e(L(t));
            });
        }
        getObjectByName(e) {
            const t = this.scene.getObjectByName(e);
            return t ? L(t) : void 0;
        }
        getObjectByUUID(e) {
            const t = this.scene.getObjectByProperty("uuid", e);
            return t ? L(t) : void 0;
        }
        setBackgroundColor(e) {
            this.scene.background = new V(e);
        }
        setFog(e, t, o) {
            this.scene.fog = new F(e, t, o);
        }
        clearFog() {
            this.scene.fog = null;
        }
        getNativeScene() {
            return this.scene;
        }
    }
    function L(s) {
        return {
            uuid: s.uuid,
            name: s.name,
            visible: s.visible,
            position: new R(s.position),
            rotation: new x(s.rotation),
            scale: new R(s.scale),
            userData: s.userData,
            parent: s.parent ? L(s.parent) : null,
            children: s.children.map(L),
            add (e) {
                s.add(e.getNativeObject());
            },
            remove (e) {
                s.remove(e.getNativeObject());
            },
            traverse (e) {
                s.traverse((t)=>e(L(t)));
            },
            getType () {
                return s instanceof M ? y.Mesh : s instanceof $ ? y.Group : s instanceof G ? y.Light : s instanceof H ? y.Camera : s instanceof W ? y.Line : s instanceof z ? y.Points : y.Object3D;
            },
            getNativeObject () {
                return s;
            }
        };
    }
    function Z() {
        return new q;
    }
    class ee {
        tools = new Map;
        currentTool = null;
        constructor(){
            this.setupEventListeners();
        }
        registerTool(e, t) {
            this.tools.set(e, t);
        }
        unregisterTool(e) {
            this.tools.get(e) === this.currentTool && this.deactivateTool(), this.tools.delete(e);
        }
        activateTool(e) {
            const t = this.tools.get(e);
            if (!t) return console.warn(`Tool ${e} not registered`), !1;
            if (this.currentTool) {
                const o = l.activeTool;
                this.deactivateTool(), a.emit(r.TOOL_CHANGED, {
                    oldTool: o,
                    newTool: e
                });
            } else a.emit(r.TOOL_ACTIVATED, {
                toolType: e
            });
            return this.currentTool = t, l.setActiveTool(e), typeof t.activate == "function" && t.activate(), !0;
        }
        setActiveTool(e) {
            const o = {
                selection: m.SELECTION,
                navigation: m.NAVIGATION,
                measurement: m.MEASUREMENT,
                layer: m.LAYER,
                cut: m.CUT,
                section: m.CUT,
                none: m.NONE
            }[e.toLowerCase()];
            return o ? o === m.NONE ? (this.deactivateTool(), !0) : this.activateTool(o) : (console.warn(`Unknown tool name: ${e}`), !1);
        }
        deactivateTool() {
            if (!this.currentTool) return;
            const e = l.activeTool;
            typeof this.currentTool.deactivate == "function" && this.currentTool.deactivate(), a.emit(r.TOOL_DEACTIVATED, {
                toolType: e
            }), this.currentTool = null, l.setActiveTool(m.NONE);
        }
        getActiveTool() {
            return this.currentTool;
        }
        getActiveToolType() {
            return l.activeTool;
        }
        isToolActive(e) {
            return l.activeTool === e;
        }
        getRegisteredTools() {
            return Array.from(this.tools.keys());
        }
        isToolRegistered(e) {
            return this.tools.has(e);
        }
        setupEventListeners() {
            a.on(r.NAVIGATION_MODE_CHANGED, ()=>{
                this.currentTool && (l.activeTool, m.MEASUREMENT);
            }), a.on("TOOL_SET_ACTIVE", (e)=>{
                const t = e.tool;
                t && (console.log(`📨 ToolManager: Received TOOL_SET_ACTIVE event for ${t}`), this.setActiveTool(t));
            });
        }
        dispose() {
            this.deactivateTool(), this.tools.clear();
        }
    }
    class te {
        workPackages = new Map;
        informationContainers = new Map;
        createNewProject(e) {
            l.updateProjectContext({
                projectName: e,
                projectPath: "",
                modelLoaded: !1,
                modelName: ""
            });
        }
        modelLoaded(e, t, o) {
            if (l.updateProjectContext({
                modelLoaded: !0,
                modelName: e
            }), t && o !== void 0) {
                const i = this.createModelContainer(e, o);
                i && this.addInformationContainerToWorkPackage(t, i);
            }
        }
        getProjectInfo() {
            const e = l.projectContext;
            return {
                name: e.projectName,
                path: e.projectPath,
                hasModel: e.modelLoaded,
                modelName: e.modelName
            };
        }
        hasModelLoaded() {
            return l.projectContext.modelLoaded;
        }
        resetProject() {
            l.updateProjectContext({
                projectName: "Untitled",
                projectPath: "",
                modelLoaded: !1,
                modelName: ""
            });
        }
        reset() {
            this.resetProject();
        }
        getProjectName() {
            return l.projectContext.projectName;
        }
        getLoadedAssets() {
            return [];
        }
        createWorkPackage(e, t, o) {
            const i = {
                id: this.generateId(),
                name: e,
                description: t,
                status: "WIP",
                created: new Date,
                modified: new Date,
                dueDate: o,
                informationContainers: []
            };
            return this.workPackages.set(i.id, i), console.log(`📦 Work Package criado: ${e} (ID: ${i.id})`), a.emit(r.PROJECT_UPDATED, {
                workPackageCreated: i.id
            }), i;
        }
        updateWorkPackageStatus(e, t) {
            const o = this.workPackages.get(e);
            return o ? (o.status = t, o.modified = new Date, console.log(`📦 Work Package ${o.name} status atualizado para: ${t}`), a.emit(r.PROJECT_UPDATED, {
                workPackageUpdated: e
            }), !0) : !1;
        }
        addInformationContainerToWorkPackage(e, t) {
            const o = this.workPackages.get(e);
            if (!o) return null;
            const i = {
                ...t,
                id: this.generateId(),
                created: new Date,
                modified: new Date
            };
            return this.informationContainers.set(i.id, i), o.informationContainers.push(i), o.modified = new Date, console.log(`📄 Information Container adicionado: ${t.name} ao Work Package ${o.name}`), a.emit(r.PROJECT_UPDATED, {
                containerAdded: i.id
            }), i;
        }
        updateInformationContainerStatus(e, t) {
            const o = this.informationContainers.get(e);
            return o ? (o.status = t, o.modified = new Date, console.log(`📄 Container ${o.name} status atualizado para: ${t}`), a.emit(r.PROJECT_UPDATED, {
                containerUpdated: e
            }), !0) : !1;
        }
        associateModelToContainer(e, t) {
            const o = this.informationContainers.get(e);
            return o ? (o.modelId = t, o.modified = new Date, console.log(`🔗 Modelo IFC ${t} associado ao container ${o.name}`), !0) : !1;
        }
        getWorkPackages() {
            return Array.from(this.workPackages.values());
        }
        updateWorkPackage(e, t) {
            const o = this.workPackages.get(e);
            return o ? (t.name !== void 0 && (o.name = t.name), t.description !== void 0 && (o.description = t.description), t.dueDate !== void 0 && (o.dueDate = t.dueDate), o.modified = new Date, console.log(`📦 Work Package ${o.name} atualizado`), a.emit(r.PROJECT_UPDATED, {
                workPackageUpdated: e
            }), !0) : !1;
        }
        deleteWorkPackage(e) {
            const t = this.workPackages.get(e);
            return t ? (t.informationContainers.forEach((o)=>{
                this.informationContainers.delete(o.id);
            }), this.workPackages.delete(e), console.log(`📦 Work Package removido: ${t.name}`), a.emit(r.PROJECT_UPDATED, {
                workPackageDeleted: e
            }), !0) : !1;
        }
        getInformationContainers() {
            return Array.from(this.informationContainers.values());
        }
        getInformationContainer(e) {
            return this.informationContainers.get(e);
        }
        createInformationContainer(e, t, o = "WIP") {
            const i = {
                id: this.generateId(),
                name: e,
                type: t,
                status: o,
                version: "1.0",
                created: new Date,
                modified: new Date,
                metadata: {}
            };
            return this.informationContainers.set(i.id, i), console.log(`📄 Information Container criado: ${e} (Tipo: ${t})`), a.emit(r.PROJECT_UPDATED, {
                containerCreated: i.id
            }), i;
        }
        updateInformationContainer(e, t) {
            const o = this.informationContainers.get(e);
            return o ? (t.name !== void 0 && (o.name = t.name), t.version !== void 0 && (o.version = t.version), t.metadata !== void 0 && (o.metadata = {
                ...o.metadata,
                ...t.metadata
            }), o.modified = new Date, console.log(`📄 Information Container ${o.name} atualizado`), a.emit(r.PROJECT_UPDATED, {
                containerUpdated: e
            }), !0) : !1;
        }
        deleteInformationContainer(e) {
            const t = this.informationContainers.get(e);
            if (!t) return !1;
            for (const o of this.workPackages.values())o.informationContainers = o.informationContainers.filter((i)=>i.id !== e);
            return this.informationContainers.delete(e), console.log(`📄 Information Container removido: ${t.name}`), a.emit(r.PROJECT_UPDATED, {
                containerDeleted: e
            }), !0;
        }
        generateId() {
            return `bim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        createModelContainer(e, t) {
            return {
                name: `Modelo: ${e}`,
                type: "MODEL",
                status: "WIP",
                version: "1.0",
                modelId: t,
                metadata: {
                    fileName: e,
                    loadedAt: new Date().toISOString()
                }
            };
        }
        exportBIMData() {
            const e = {
                schema: "ISO 19650",
                version: "1.0",
                project: {
                    name: this.getProjectName(),
                    exportedAt: new Date().toISOString()
                },
                workPackages: this.workPackages,
                informationContainers: this.informationContainers
            };
            return JSON.stringify(e, null, 2);
        }
        importBIMData(e) {
            try {
                const t = JSON.parse(e);
                if (t.schema !== "ISO 19650") throw new Error("Formato não compatível com ISO 19650");
                if (t.workPackages) for (const [o, i] of Object.entries(t.workPackages))this.workPackages.set(o, i);
                if (t.informationContainers) for (const [o, i] of Object.entries(t.informationContainers))this.informationContainers.set(o, i);
                return console.log(`📥 BIM data imported: ${this.workPackages.size} work packages, ${this.informationContainers.size} containers`), a.emit(r.PROJECT_UPDATED, {
                    bimDataImported: !0
                }), !0;
            } catch (t) {
                return console.error("❌ Erro ao importar dados BIM:", t), !1;
            }
        }
        exportBIMDataXML() {
            let e = `<?xml version="1.0" encoding="UTF-8"?>
`;
            e += `<BIMData schema="ISO 19650" version="1.0">
`, e += `  <Project name="${this.getProjectName()}" exportedAt="${new Date().toISOString()}" />
`, e += `  <WorkPackages>
`;
            for (const t of this.workPackages.values())e += `    <WorkPackage id="${t.id}" name="${t.name}" status="${t.status}">
`, e += `      <Description>${t.description}</Description>
`, e += `      <Created>${t.created.toISOString()}</Created>
`, e += `      <Modified>${t.modified.toISOString()}</Modified>
`, t.dueDate && (e += `      <DueDate>${t.dueDate.toISOString()}</DueDate>
`), e += `    </WorkPackage>
`;
            e += `  </WorkPackages>
`, e += `  <InformationContainers>
`;
            for (const t of this.informationContainers.values()){
                e += `    <InformationContainer id="${t.id}" name="${t.name}" type="${t.type}" status="${t.status}" version="${t.version}">
`, e += `      <Created>${t.created.toISOString()}</Created>
`, e += `      <Modified>${t.modified.toISOString()}</Modified>
`, e += `      <Metadata>
`;
                for (const [o, i] of Object.entries(t.metadata))e += `        <${o}>${i}</${o}>
`;
                e += `      </Metadata>
`, e += `    </InformationContainer>
`;
            }
            return e += `  </InformationContainers>
`, e += `</BIMData>
`, e;
        }
        setupEventListeners() {
            a.on(r.MODEL_LOADED, ({ fileName: e })=>{
                this.modelLoaded(e);
            }), a.on(r.MODEL_ERROR, ({ error: e, fileName: t })=>{
                console.error(`Failed to load model ${t}:`, e), l.updateProjectContext({
                    modelLoaded: !1,
                    modelName: ""
                });
            }), a.on(r.PROJECT_NEW, (e)=>{
                console.log("📨 ProjectManager: Received PROJECT_NEW event", e);
                const t = e.template || "empty";
                this.createNewProject(`Untitled (${t})`);
            }), a.on(r.PROJECT_RESET, ()=>{
                console.log("📨 ProjectManager: Received PROJECT_RESET event"), this.reset();
            });
        }
        dispose() {
            this.resetProject();
        }
    }
    class O {
        static instance;
        currentVersion = "1.0.0";
        versionHistory = [];
        maxVersions = 50;
        constructor(){
            console.log("💾 ProjectSerializer initialized");
        }
        static getInstance() {
            return O.instance || (O.instance = new O), O.instance;
        }
        serialize(e, t, o = "Untitled") {
            console.log("📦 Serializing project...");
            const i = E.getState(), u = this.serializeSceneObjects(e), c = this.serializeLayers(), g = {
                meta: {
                    version: "1.0.0",
                    name: o,
                    description: "",
                    created: Date.now(),
                    modified: Date.now(),
                    author: "ArxisVR",
                    projectVersion: this.currentVersion,
                    versionHistory: this.versionHistory
                },
                camera: {
                    position: [
                        t.position.x,
                        t.position.y,
                        t.position.z
                    ],
                    rotation: [
                        t.rotation.x,
                        t.rotation.y,
                        t.rotation.z
                    ],
                    fov: t.fov || 75
                },
                scene: {
                    background: e.background?.getHex() || 8900331,
                    fog: e.fog ? {
                        color: e.fog.color.getHex(),
                        near: e.fog.near,
                        far: e.fog.far
                    } : void 0
                },
                objects: u,
                layers: c,
                settings: {
                    renderQuality: i.graphicsSettings.quality,
                    shadowsEnabled: i.graphicsSettings.shadowsEnabled,
                    navigationMode: i.navigationMode
                },
                state: {
                    selectedObjects: i.selectedObjects.map((p)=>p.object.uuid),
                    activeTool: i.activeTool,
                    uiVisible: i.uiVisible,
                    leftPanelOpen: i.leftPanelOpen,
                    rightInspectorOpen: i.rightInspectorOpen,
                    bottomDockOpen: i.bottomDockOpen
                }
            };
            return console.log(`✅ Project serialized: ${u.length} objects, ${c.length} layers`), g;
        }
        createVersion(e, t, o, i = "ArxisVR", u = []) {
            const c = this.currentVersion.split(".").map(Number);
            c[2]++, this.currentVersion = c.join(".");
            const g = this.serialize(e, t, `Version ${this.currentVersion}`), p = {
                id: this.generateVersionId(),
                version: this.currentVersion,
                timestamp: Date.now(),
                author: i,
                description: o,
                changes: u,
                snapshot: g
            };
            return this.versionHistory.push(p), this.versionHistory.length > this.maxVersions && this.versionHistory.shift(), console.log(`📝 Nova versão criada: ${this.currentVersion} - ${o}`), p;
        }
        async revertToVersion(e, t, o) {
            const i = this.versionHistory.find((u)=>u.id === e);
            if (!i) return console.error(`❌ Versão ${e} não encontrada`), !1;
            try {
                return await this.deserialize(i.snapshot, t, o), this.currentVersion = i.version, console.log(`↩️ Revertido para versão ${i.version}: ${i.description}`), !0;
            } catch (u) {
                return console.error("❌ Erro ao reverter versão:", u), !1;
            }
        }
        getVersionHistory() {
            return [
                ...this.versionHistory
            ];
        }
        getCurrentVersion() {
            return this.currentVersion;
        }
        compareVersions(e, t) {
            const o = this.versionHistory.find((p)=>p.id === e), i = this.versionHistory.find((p)=>p.id === t);
            if (!o || !i) return [];
            const u = [], c = new Set(o.snapshot.objects.map((p)=>p.uuid)), g = new Set(i.snapshot.objects.map((p)=>p.uuid));
            for (const p of g)c.has(p) || u.push({
                type: "add",
                target: "object",
                targetId: p,
                description: "Objeto adicionado"
            });
            for (const p of c)g.has(p) || u.push({
                type: "remove",
                target: "object",
                targetId: p,
                description: "Objeto removido"
            });
            return u;
        }
        generateVersionId() {
            return `ver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        async deserialize(e, t, o) {
            console.log(`📂 Deserializing project: ${e.meta.name}...`);
            try {
                e.meta.projectVersion && (this.currentVersion = e.meta.projectVersion), e.meta.versionHistory && (this.versionHistory = e.meta.versionHistory), this.clearScene(t), e.scene.background !== void 0 && (t.background = new V(e.scene.background)), e.scene.fog && (t.fog = new F(e.scene.fog.color, e.scene.fog.near, e.scene.fog.far)), o.position.set(...e.camera.position), o.rotation.set(...e.camera.rotation), o instanceof B && (o.fov = e.camera.fov, o.updateProjectionMatrix());
                for (const i of e.objects){
                    const u = this.deserializeObject(i);
                    u && t.add(u);
                }
                this.deserializeLayers(e.layers), E.setRenderQuality(e.settings.renderQuality), E.setNavigationMode(e.settings.navigationMode), E.setUIVisible(e.state.uiVisible), console.log("✅ Project loaded successfully");
            } catch (i) {
                throw console.error("❌ Failed to deserialize project:", i), i;
            }
        }
        serializeSceneObjects(e) {
            const t = [];
            return e.children.forEach((o)=>{
                if (this.shouldSerializeObject(o)) {
                    const i = this.serializeObject(o);
                    i && t.push(i);
                }
            }), t;
        }
        shouldSerializeObject(e) {
            return !([
                "GridHelper",
                "AxesHelper",
                "DirectionalLightHelper",
                "PointLightHelper"
            ].includes(e.type) || e.name && (e.name.includes("Helper") || e.name.includes("Grid")));
        }
        serializeObject(e) {
            try {
                const t = {
                    uuid: e.uuid,
                    type: e.type,
                    name: e.name,
                    position: [
                        e.position.x,
                        e.position.y,
                        e.position.z
                    ],
                    rotation: [
                        e.rotation.x,
                        e.rotation.y,
                        e.rotation.z
                    ],
                    scale: [
                        e.scale.x,
                        e.scale.y,
                        e.scale.z
                    ],
                    visible: e.visible,
                    userData: JSON.parse(JSON.stringify(e.userData)),
                    children: []
                };
                return e instanceof M && (t.geometry = {
                    type: e.geometry.type,
                    parameters: e.geometry.parameters
                }, e.material && (t.material = {
                    type: e.material.type,
                    properties: this.serializeMaterial(e.material)
                })), e.children.forEach((o)=>{
                    if (this.shouldSerializeObject(o)) {
                        const i = this.serializeObject(o);
                        i && t.children.push(i);
                    }
                }), t;
            } catch (t) {
                return console.warn(`⚠️ Failed to serialize object ${e.name}:`, t), null;
            }
        }
        serializeMaterial(e) {
            const t = {
                color: e.color?.getHex(),
                opacity: e.opacity,
                transparent: e.transparent,
                visible: e.visible
            };
            return e instanceof D && (t.metalness = e.metalness, t.roughness = e.roughness, t.emissive = e.emissive.getHex(), t.emissiveIntensity = e.emissiveIntensity), t;
        }
        deserializeObject(e) {
            try {
                let t;
                if (e.type === "Mesh" && e.geometry && e.material) {
                    const o = this.createGeometry(e.geometry), i = this.createMaterial(e.material);
                    t = new M(o, i);
                } else t = new X;
                return t.uuid = e.uuid, t.name = e.name, t.position.set(...e.position), t.rotation.set(...e.rotation), t.scale.set(...e.scale), t.visible = e.visible, t.userData = JSON.parse(JSON.stringify(e.userData)), e.children.forEach((o)=>{
                    const i = this.deserializeObject(o);
                    i && t.add(i);
                }), t;
            } catch (t) {
                return console.warn(`⚠️ Failed to deserialize object ${e.name}:`, t), null;
            }
        }
        createGeometry(e) {
            return new J(1, 1, 1);
        }
        createMaterial(e) {
            const t = e.properties;
            return e.type === "MeshStandardMaterial" ? new D({
                color: t.color,
                metalness: t.metalness,
                roughness: t.roughness,
                emissive: t.emissive,
                emissiveIntensity: t.emissiveIntensity,
                opacity: t.opacity,
                transparent: t.transparent
            }) : new D({
                color: t.color || 16777215
            });
        }
        serializeLayers() {
            return E.getLayers().map((t)=>({
                    id: t.id,
                    name: t.name,
                    type: "default",
                    category: "general",
                    color: t.color || "#ffffff",
                    visible: t.visible,
                    locked: t.locked,
                    plotable: !0,
                    objectIds: []
                }));
        }
        deserializeLayers(e) {
            console.log("ℹ️ Layer deserialization not fully implemented yet");
        }
        clearScene(e) {
            const t = [];
            e.children.forEach((o)=>{
                this.shouldSerializeObject(o) && t.push(o);
            }), t.forEach((o)=>e.remove(o)), console.log(`🧹 Cleared ${t.length} objects from scene`);
        }
        saveToFile(e, t) {
            const o = JSON.stringify(e, null, 2), i = new Blob([
                o
            ], {
                type: "application/json"
            }), u = URL.createObjectURL(i), c = document.createElement("a");
            c.href = u, c.download = t || `${e.meta.name}.arxis.json`, c.click(), URL.revokeObjectURL(u), console.log(`💾 Project saved: ${c.download}`);
        }
        async loadFromFile(e) {
            return new Promise((t, o)=>{
                const i = new FileReader;
                i.onload = (u)=>{
                    try {
                        const c = u.target?.result, g = JSON.parse(c);
                        if (!g.meta || !g.meta.version) throw new Error("Invalid project file format");
                        console.log(`📂 Project loaded from file: ${g.meta.name}`), t(g);
                    } catch (c) {
                        console.error("❌ Failed to parse project file:", c), o(c);
                    }
                }, i.onerror = ()=>{
                    o(new Error("Failed to read file"));
                }, i.readAsText(e);
            });
        }
    }
    const C = O.getInstance();
    class oe {
        outlineMaterial;
        selectedOutline = null;
        constructor(){
            this.outlineMaterial = new Y({
                color: 65416,
                linewidth: 2
            }), this.setupEventListeners();
        }
        selectObject(e, t) {
            l.selectedObject && this.deselectObject(), e && (l.setSelectedObject(e), this.createOutline(e), a.emit(r.OBJECT_SELECTED, {
                object: e,
                expressID: t
            }), a.emit(r.SELECTION_CHANGED, {
                selected: e
            }));
        }
        deselectObject() {
            const e = l.selectedObject;
            e && (this.removeOutline(), l.setSelectedObject(null), l.setSelectedElement(null), a.emit(r.OBJECT_DESELECTED, {
                object: e
            }), a.emit(r.SELECTION_CHANGED, {
                selected: null
            }));
        }
        deselectAll() {
            this.deselectObject(), l.setSelectedObjects([]);
        }
        setSelectedElement(e) {
            l.setSelectedElement(e);
        }
        getSelectedObject() {
            return l.selectedObject;
        }
        getSelectedElement() {
            return l.selectedElement;
        }
        hasSelection() {
            return l.selectedObject !== null;
        }
        createOutline(e) {
            if (!(e instanceof M)) return;
            const t = e.geometry, o = new Q(t, 15);
            this.selectedOutline = new K(o, this.outlineMaterial), this.selectedOutline.position.copy(e.position), this.selectedOutline.rotation.copy(e.rotation), this.selectedOutline.scale.copy(e.scale), e.parent && e.parent.add(this.selectedOutline);
        }
        removeOutline() {
            this.selectedOutline && (this.selectedOutline.parent && this.selectedOutline.parent.remove(this.selectedOutline), this.selectedOutline.geometry.dispose(), this.selectedOutline = null);
        }
        setupEventListeners() {
            a.on(r.TOOL_CHANGED, ()=>{});
        }
        dispose() {
            this.deselectObject(), this.outlineMaterial.dispose();
        }
    }
    class se {
        constructor(){
            this.setupEventListeners();
        }
        setNavigationMode(e) {
            l.navigationMode !== e && (l.setNavigationMode(e), a.emit(r.NAVIGATION_MODE_CHANGED, {
                mode: e
            }), a.emit(r.CAMERA_MODE_CHANGED, {
                mode: e
            }));
        }
        getNavigationMode() {
            return l.navigationMode;
        }
        toggleNavigationMode() {
            switch(l.navigationMode){
                case f.FLY:
                    this.setNavigationMode(f.WALK);
                    break;
                case f.WALK:
                    this.setNavigationMode(f.FLY);
                    break;
                case f.VR:
                    this.setNavigationMode(f.FLY);
                    break;
            }
        }
        enableVRMode() {
            this.setNavigationMode(f.VR);
        }
        disableVRMode() {
            l.navigationMode === f.VR && this.setNavigationMode(f.FLY);
        }
        isVRMode() {
            return l.navigationMode === f.VR;
        }
        isWalkMode() {
            return l.navigationMode === f.WALK;
        }
        isFlyMode() {
            return l.navigationMode === f.FLY;
        }
        setupEventListeners() {}
        dispose() {}
    }
    class ie {
        scene = null;
        constructor(){
            this.setupEventListeners(), this.createDefaultLayer();
        }
        setScene(e) {
            this.scene = e;
        }
        createDefaultLayer() {
            const e = {
                id: "layer-0",
                name: "0 (Padrão)",
                visible: !0,
                locked: !1,
                opacity: 1
            };
            l.addLayer(e), l.setActiveLayerId(e.id);
        }
        createLayer(e, t, o = !0) {
            const i = `layer-${Date.now()}`, u = {
                id: i,
                name: e,
                visible: o,
                locked: !1,
                color: t,
                opacity: 1
            };
            return l.addLayer(u), a.emit(r.LAYER_CREATED, {
                layerId: i,
                layerName: e
            }), i;
        }
        removeLayer(e) {
            if (!l.getLayer(e)) {
                console.warn(`Layer ${e} not found`);
                return;
            }
            if (e === "layer-0") {
                console.warn("Cannot remove default layer");
                return;
            }
            l.removeLayer(e), a.emit(r.LAYER_DELETED, {
                layerId: e
            }), l.activeLayerId === e && l.setActiveLayerId("layer-0");
        }
        toggleLayerVisibility(e) {
            const t = l.getLayer(e);
            if (!t) {
                console.warn(`Layer ${e} not found`);
                return;
            }
            const o = !t.visible;
            l.updateLayer(e, {
                visible: o
            }), a.emit(r.LAYER_TOGGLED, {
                layerId: e,
                visible: o
            }), this.updateObjectsVisibility(e, o);
        }
        setLayerVisibility(e, t) {
            if (!l.getLayer(e)) {
                console.warn(`Layer ${e} not found`);
                return;
            }
            l.updateLayer(e, {
                visible: t
            }), a.emit(r.LAYER_TOGGLED, {
                layerId: e,
                visible: t
            }), this.updateObjectsVisibility(e, t);
        }
        toggleLayerLock(e) {
            const t = l.getLayer(e);
            if (!t) {
                console.warn(`Layer ${e} not found`);
                return;
            }
            const o = !t.locked;
            l.updateLayer(e, {
                locked: o
            }), a.emit(r.LAYER_LOCKED, {
                layerId: e,
                locked: o
            });
        }
        setActiveLayer(e) {
            if (!l.getLayer(e)) {
                console.warn(`Layer ${e} not found`);
                return;
            }
            l.setActiveLayerId(e);
        }
        getActiveLayer() {
            const e = l.activeLayerId;
            return e ? l.getLayer(e) : void 0;
        }
        getLayers() {
            return Array.from(l.layers.values());
        }
        getLayer(e) {
            return l.getLayer(e);
        }
        hasLayer(e) {
            return l.getLayer(e) !== void 0;
        }
        clearLayers() {
            this.getLayers().forEach((t)=>{
                this.removeLayer(t.id);
            }), l.setActiveLayerId(null), console.log("🧹 All layers cleared");
        }
        updateObjectsVisibility(e, t) {
            this.scene && this.scene.traverse((o)=>{
                o.userData?.layerId === e && (o.visible = t);
            });
        }
        assignObjectToLayer(e, t) {
            const o = l.getLayer(t);
            if (!o) {
                console.warn(`Layer ${t} not found`);
                return;
            }
            e.userData.layerId = t, e.visible = o.visible;
        }
        setupEventListeners() {}
        clear() {
            Array.from(l.layers.values()).forEach((t)=>{
                l.removeLayer(t.id);
            });
        }
        dispose() {
            this.scene = null;
        }
    }
    class k {
        scene;
        renderer;
        sections = new Map;
        clippingPlanes = [];
        visualOptions = {
            showSectionLines: !0,
            showClippingPlanes: !0,
            sectionLineColor: "#ff0000",
            sectionLineWidth: 2,
            fillColor: "#ffff00",
            fillOpacity: .3
        };
        activeSection = null;
        constructor(e, t){
            this.scene = e, this.renderer = t || null, console.log("✂️ SectionManager initialized");
        }
        createSection(e, t = 0) {
            const o = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            let i, u;
            switch(e){
                case "x-axis":
                    i = new w(new I(1, 0, 0), -t), u = `Section X (${t.toFixed(2)})`;
                    break;
                case "y-axis":
                    i = new w(new I(0, 1, 0), -t), u = `Section Y (${t.toFixed(2)})`;
                    break;
                case "z-axis":
                    i = new w(new I(0, 0, 1), -t), u = `Section Z (${t.toFixed(2)})`;
                    break;
                default:
                    i = new w(new I(0, 1, 0), -t), u = "Custom Section";
            }
            const c = {
                id: o,
                name: u,
                type: e,
                plane: i,
                helper: null,
                visible: !0,
                enabled: !0
            };
            return this.visualOptions.showClippingPlanes && (c.helper = new P(i, 20, 16711680), this.scene.add(c.helper)), this.sections.set(o, c), this.updateClippingPlanes(), a.emit(r.SECTION_CREATED, c), console.log(`✂️ Section created: ${u}`), c;
        }
        removeSection(e) {
            const t = this.sections.get(e);
            t && (t.helper && (this.scene.remove(t.helper), t.helper.geometry.dispose(), t.helper.material.dispose()), this.sections.delete(e), this.updateClippingPlanes(), a.emit(r.SECTION_REMOVED, e), console.log(`✂️ Section removed: ${t.name}`));
        }
        updateSectionPosition(e, t) {
            const o = this.sections.get(e);
            o && (o.plane.constant = -t, o.helper && o.helper.updateMatrixWorld(!0), this.updateClippingPlanes(), a.emit(r.SECTION_UPDATED, o));
        }
        flipSection(e) {
            const t = this.sections.get(e);
            t && (t.plane.normal.negate(), t.plane.constant = -t.plane.constant, t.helper && (this.scene.remove(t.helper), t.helper.geometry.dispose(), t.helper.material.dispose(), t.helper = new P(t.plane, 20, 16711680), this.scene.add(t.helper)), this.updateClippingPlanes(), a.emit(r.SECTION_UPDATED, t), console.log(`✂️ Section flipped: ${t.name}`));
        }
        toggleSection(e, t) {
            const o = this.sections.get(e);
            o && (o.enabled = t, o.helper && (o.helper.visible = t && o.visible), this.updateClippingPlanes(), a.emit(r.SECTION_TOGGLED, {
                sectionId: e,
                enabled: t
            }));
        }
        toggleSectionVisibility(e, t) {
            const o = this.sections.get(e);
            o && (o.visible = t, o.helper && (o.helper.visible = t && o.enabled));
        }
        updateClippingPlanes() {
            this.clippingPlanes = Array.from(this.sections.values()).filter((e)=>e.enabled).map((e)=>e.plane), this.renderer && (this.renderer.clippingPlanes = this.clippingPlanes, this.renderer.localClippingEnabled = this.clippingPlanes.length > 0), this.scene.traverse((e)=>{
                if (e.isMesh) {
                    const t = e;
                    Array.isArray(t.material) ? t.material.forEach((o)=>{
                        o.clippingPlanes = this.clippingPlanes;
                    }) : t.material && (t.material.clippingPlanes = this.clippingPlanes);
                }
            });
        }
        clearSections() {
            this.sections.forEach((e)=>{
                e.helper && (this.scene.remove(e.helper), e.helper.geometry.dispose(), e.helper.material.dispose());
            }), this.sections.clear(), this.updateClippingPlanes(), a.emit(r.SECTIONS_CLEARED), console.log("✂️ All sections cleared");
        }
        getSections() {
            return Array.from(this.sections.values());
        }
        getSection(e) {
            return this.sections.get(e);
        }
        updateVisualOptions(e) {
            this.visualOptions = {
                ...this.visualOptions,
                ...e
            }, this.sections.forEach((t)=>{
                this.visualOptions.showClippingPlanes && !t.helper ? (t.helper = new P(t.plane, 20, 16711680), this.scene.add(t.helper)) : !this.visualOptions.showClippingPlanes && t.helper && (this.scene.remove(t.helper), t.helper.geometry.dispose(), t.helper.material.dispose(), t.helper = null);
            }), a.emit(r.SECTION_VISUAL_OPTIONS_UPDATED, this.visualOptions);
        }
        getVisualOptions() {
            return {
                ...this.visualOptions
            };
        }
        setActiveSection(e) {
            if (e === null) {
                this.activeSection = null;
                return;
            }
            const t = this.sections.get(e);
            t && (this.activeSection = t, a.emit(r.SECTION_ACTIVATED, t));
        }
        getActiveSection() {
            return this.activeSection;
        }
        createBoxClipping(e, t) {
            this.clearSections(), this.createSection("x-axis", t.x), this.createSection("x-axis", -e.x), this.createSection("y-axis", t.y), this.createSection("y-axis", -e.y), this.createSection("z-axis", t.z), this.createSection("z-axis", -e.z), console.log("✂️ Box clipping created");
        }
        dispose() {
            this.clearSections(), console.log("✂️ SectionManager disposed");
        }
    }
    class ne {
        ifcLoader = null;
        cache = new Map;
        constructor(e){
            this.ifcLoader = e || null;
        }
        setIFCLoader(e) {
            this.ifcLoader = e, this.cache.clear();
        }
        async getElementProperties(e, t) {
            if (!this.ifcLoader) return console.warn("IFCLoader não configurado"), null;
            const o = `${e}-${t}`;
            if (this.cache.has(o)) return this.cache.get(o);
            try {
                const i = await this.ifcLoader.getProperties(e, t);
                if (!i) return null;
                const c = (await this.ifcLoader.getAllProperties(e, t))?.psets || [], g = await this.ifcLoader.getType(e, t), p = {
                    basic: {
                        expressID: t,
                        type: i.type || "UNKNOWN",
                        globalId: i.GlobalId?.value || "N/A",
                        name: i.Name?.value || i.LongName?.value || "Unnamed",
                        description: i.Description?.value
                    },
                    geometry: this.extractGeometryProperties(i, c),
                    material: this.extractMaterialProperties(c),
                    location: await this.extractLocationProperties(e, t),
                    properties: this.extractProperties(i),
                    propertySets: c,
                    typeProperties: g
                };
                return this.cache.set(o, p), p;
            } catch (i) {
                return console.error(`Erro ao obter propriedades do elemento ${t}:`, i), null;
            }
        }
        extractGeometryProperties(e, t) {
            const o = {};
            return t.forEach((i)=>{
                i.HasProperties && i.HasProperties.forEach((u)=>{
                    const c = u.Name?.value?.toLowerCase() || "", g = u.NominalValue?.value;
                    c.includes("volume") && g ? o.volume = parseFloat(g) : c.includes("area") && g ? o.area = parseFloat(g) : c.includes("length") && g ? o.length = parseFloat(g) : c.includes("width") && g ? o.width = parseFloat(g) : c.includes("height") && g && (o.height = parseFloat(g));
                });
            }), e.OverallWidth?.value && (o.width = e.OverallWidth.value), e.OverallHeight?.value && (o.height = e.OverallHeight.value), e.Length?.value && (o.length = e.Length.value), Object.keys(o).length > 0 ? o : void 0;
        }
        extractMaterialProperties(e) {
            const t = {};
            return e.forEach((o)=>{
                (o.Name?.value?.includes("Material") || o.Name?.value?.includes("Pset_MaterialCommon")) && o.HasProperties && o.HasProperties.forEach((i)=>{
                    const u = i.Name?.value?.toLowerCase() || "", c = i.NominalValue?.value;
                    u.includes("name") && c ? t.name = c : u.includes("thickness") && c && (t.layerThickness = parseFloat(c));
                });
            }), Object.keys(t).length > 0 ? t : void 0;
        }
        async extractLocationProperties(e, t) {
            if (this.ifcLoader) try {
                const o = await this.ifcLoader.getSpatialStructure(e, t);
                return;
            } catch  {
                return;
            }
        }
        extractProperties(e) {
            const t = [];
            return Object.keys(e).forEach((o)=>{
                if (o === "expressID" || o === "type") return;
                const i = e[o];
                i != null && (typeof i == "object" && i.value !== void 0 ? t.push({
                    name: o,
                    value: i.value
                }) : typeof i != "object" && t.push({
                    name: o,
                    value: i
                }));
            }), t;
        }
        toIFCElement(e) {
            return {
                expressID: e.basic.expressID,
                type: e.basic.type,
                globalId: e.basic.globalId,
                name: e.basic.name,
                properties: e.properties,
                bimProperties: {
                    dimensions: e.geometry,
                    material: e.material?.name,
                    customProperties: {}
                }
            };
        }
        clearCache() {
            this.cache.clear();
        }
        getCacheStats() {
            return {
                size: this.cache.size,
                keys: Array.from(this.cache.keys())
            };
        }
    }
    const re = new ne;
    var n = ((s)=>(s.FILE_NEW = "file.new", s.FILE_OPEN = "file.open", s.FILE_OPEN_IFC = "file.open.ifc", s.FILE_OPEN_GLTF = "file.open.gltf", s.FILE_OPEN_OBJ = "file.open.obj", s.FILE_SAVE = "file.save", s.FILE_SAVE_AS = "file.saveAs", s.FILE_EXPORT_OBJ = "file.export.obj", s.FILE_EXPORT_GLTF = "file.export.gltf", s.FILE_EXPORT_GLB = "file.export.glb", s.FILE_EXPORT_IFC = "file.export.ifc", s.FILE_EXPORT_SCREENSHOT = "file.export.screenshot", s.FILE_EXPORT_SELECTION = "file.export.selection", s.FILE_RECENT = "file.recent", s.FILE_CLOSE = "file.close", s.EDIT_UNDO = "edit.undo", s.EDIT_REDO = "edit.redo", s.EDIT_CUT = "edit.cut", s.EDIT_COPY = "edit.copy", s.EDIT_PASTE = "edit.paste", s.EDIT_DELETE = "edit.delete", s.EDIT_SELECT_ALL = "edit.selectAll", s.EDIT_DESELECT_ALL = "edit.deselectAll", s.VIEW_TOP = "view.camera.top", s.VIEW_FRONT = "view.camera.front", s.VIEW_SIDE = "view.camera.side", s.VIEW_ISOMETRIC = "view.camera.isometric", s.VIEW_FOCUS_SELECTION = "view.focus.selection", s.VIEW_FRAME_ALL = "view.frame.all", s.VIEW_TOGGLE_GRID = "view.toggle.grid", s.VIEW_TOGGLE_AXES = "view.toggle.axes", s.VIEW_TOGGLE_STATS = "view.toggle.stats", s.VIEW_FULLSCREEN = "view.fullscreen", s.VIEW_SET_RENDER_QUALITY = "view.setRenderQuality", s.VIEW_SET_CAMERA_MODE = "view.setCameraMode", s.MODEL_SHOW_ALL = "model.show.all", s.MODEL_HIDE_SELECTED = "model.hide.selected", s.MODEL_ISOLATE_SELECTED = "model.isolate.selected", s.MODEL_HIDE_BY_CLASS = "model.hide.byClass", s.MODEL_SHOW_BY_CLASS = "model.show.byClass", s.MODEL_PROPERTIES = "model.properties", s.TOOL_SELECT = "tool.select", s.TOOL_MEASURE = "tool.measure", s.TOOL_NAVIGATE = "tool.navigate", s.TOOL_LAYER = "tool.layer", s.XR_ENTER = "xr.enter", s.XR_EXIT = "xr.exit", s.XR_TOGGLE = "xr.toggle", s.XR_RECENTER = "xr.recenter", s.NET_CONNECT = "network.connect", s.NET_DISCONNECT = "network.disconnect", s.NET_CREATE_ROOM = "network.room.create", s.NET_JOIN_ROOM = "network.room.join", s.NET_LEAVE_ROOM = "network.room.leave", s.NET_TOGGLE_VOIP = "network.voip.toggle", s.THEME_SELECT = "theme.select", s.THEME_DARK = "theme.dark", s.THEME_LIGHT = "theme.light", s.THEME_HIGH_CONTRAST = "theme.highContrast", s.AI_OPEN_CHAT = "ai.chat.open", s.AI_CLOSE_CHAT = "ai.chat.close", s.AI_TOGGLE_CHAT = "ai.chat.toggle", s.AI_CLEAR_HISTORY = "ai.chat.clearHistory", s.SCRIPT_RUN = "script.run", s.SCRIPT_STOP = "script.stop", s.SCRIPT_RELOAD = "script.reload", s.HELP_DOCS = "help.docs", s.HELP_SHORTCUTS = "help.shortcuts", s.HELP_ABOUT = "help.about", s))(n || {});
    class T {
        static instance;
        commands = new Map;
        history = [];
        maxHistorySize = 100;
        constructor(){
            console.log("📋 CommandRegistry initialized");
        }
        static getInstance() {
            return T.instance || (T.instance = new T), T.instance;
        }
        register(e, t) {
            const o = {
                ...e,
                handler: t,
                enabled: e.enabled !== !1,
                visible: e.visible !== !1
            };
            this.commands.set(e.id, o), console.log(`✅ Command registered: ${e.id}`);
        }
        unregister(e) {
            this.commands.delete(e), console.log(`❌ Command unregistered: ${e}`);
        }
        async execute(e, t) {
            if (!e || typeof e != "string") return console.error("❌ Invalid command ID:", e), {
                success: !1,
                error: `Invalid command ID: ${typeof e}`
            };
            const o = this.commands.get(e);
            if (!o) return console.error(`❌ Command not found: ${e}`), {
                success: !1,
                error: `Command not found: ${e}`
            };
            if (o.enabled === !1) return console.warn(`⚠️  Command disabled: ${e}`), {
                success: !1,
                error: `Command disabled: ${e}`
            };
            try {
                a.emit(r.COMMAND_EXECUTE_BEFORE, {
                    id: e,
                    payload: t
                });
                const i = performance.now();
                await o.handler(t);
                const u = performance.now() - i;
                return this.addToHistory(e, t), a.emit(r.COMMAND_EXECUTE_SUCCESS, {
                    id: e,
                    payload: t,
                    duration: u
                }), console.log(`✅ Command executed: ${e} (${u.toFixed(2)}ms)`), {
                    success: !0,
                    message: `Command executed: ${o.label}`,
                    data: {
                        duration: u
                    }
                };
            } catch (i) {
                return console.error(`❌ Command execution failed: ${e}`, i), a.emit(r.COMMAND_EXECUTE_FAIL, {
                    id: e,
                    payload: t,
                    error: i.message
                }), {
                    success: !1,
                    error: i.message || "Unknown error",
                    data: {
                        originalError: i
                    }
                };
            }
        }
        get(e) {
            return this.commands.get(e);
        }
        getAll() {
            return Array.from(this.commands.values());
        }
        getByCategory(e) {
            return this.getAll().filter((t)=>t.id.startsWith(e));
        }
        setEnabled(e, t) {
            const o = this.commands.get(e);
            o && (o.enabled = t, a.emit(r.COMMAND_STATE_CHANGED, {
                id: e,
                enabled: t
            }));
        }
        setVisible(e, t) {
            const o = this.commands.get(e);
            o && (o.visible = t, a.emit(r.COMMAND_STATE_CHANGED, {
                id: e,
                visible: t
            }));
        }
        addToHistory(e, t) {
            this.history.push({
                id: e,
                payload: t,
                timestamp: Date.now()
            }), this.history.length > this.maxHistorySize && this.history.shift();
        }
        getHistory() {
            return [
                ...this.history
            ];
        }
        clearHistory() {
            this.history = [], console.log("🧹 Command history cleared");
        }
        getStats() {
            const e = this.getAll();
            return {
                totalCommands: e.length,
                enabledCommands: e.filter((t)=>t.enabled).length,
                visibleCommands: e.filter((t)=>t.visible).length,
                historySize: this.history.length
            };
        }
    }
    const h = T.getInstance();
    class v {
        static instance;
        history = [];
        currentIndex = -1;
        maxHistorySize = 100;
        versionSnapshots = [];
        maxVersionSnapshots = 20;
        snapshots = new Map;
        isUndoing = !1;
        isRedoing = !1;
        constructor(){
            console.log("↩️ CommandHistory initialized");
        }
        static getInstance() {
            return v.instance || (v.instance = new v), v.instance;
        }
        async execute(e) {
            try {
                await e.execute(), this.currentIndex < this.history.length - 1 && this.history.splice(this.currentIndex + 1), this.history.push(e), this.currentIndex++, this.history.length > this.maxHistorySize && (this.history.shift(), this.currentIndex--), a.emit(r.COMMAND_EXECUTE_SUCCESS, {
                    id: e.id,
                    payload: {
                        command: e.type
                    },
                    duration: 0
                }), console.log(`✅ Command executed: ${e.description()}`), this.logState();
            } catch (t) {
                throw console.error("❌ Command execution failed:", t), t;
            }
        }
        async undo() {
            if (!this.canUndo()) return console.warn("⚠️ Nothing to undo"), !1;
            this.isUndoing = !0;
            try {
                const e = this.history[this.currentIndex];
                return console.log(`↶ Undoing: ${e.description()}`), await e.undo(), this.currentIndex--, a.emit(r.EDIT_UNDO, {}), console.log("✅ Undo complete"), this.logState(), !0;
            } catch (e) {
                return console.error("❌ Undo failed:", e), !1;
            } finally{
                this.isUndoing = !1;
            }
        }
        async redo() {
            if (!this.canRedo()) return console.warn("⚠️ Nothing to redo"), !1;
            this.isRedoing = !0;
            try {
                this.currentIndex++;
                const e = this.history[this.currentIndex];
                return console.log(`↷ Redoing: ${e.description()}`), await e.redo(), a.emit(r.EDIT_REDO, {}), console.log("✅ Redo complete"), this.logState(), !0;
            } catch (e) {
                return console.error("❌ Redo failed:", e), this.currentIndex--, !1;
            } finally{
                this.isRedoing = !1;
            }
        }
        canUndo() {
            return this.currentIndex >= 0;
        }
        canRedo() {
            return this.currentIndex < this.history.length - 1;
        }
        getUndoDescription() {
            return this.canUndo() ? this.history[this.currentIndex].description() : null;
        }
        getRedoDescription() {
            return this.canRedo() ? this.history[this.currentIndex + 1].description() : null;
        }
        getHistory() {
            return [
                ...this.history
            ];
        }
        getCurrentIndex() {
            return this.currentIndex;
        }
        saveSnapshot(e, t) {
            const o = {
                id: `snapshot_${Date.now()}_${Math.random()}`,
                timestamp: Date.now(),
                data: JSON.parse(JSON.stringify(t)),
                type: e
            };
            if (this.snapshots.set(o.id, o), this.snapshots.size > 50) {
                const i = Array.from(this.snapshots.keys())[0];
                this.snapshots.delete(i);
            }
            return o.id;
        }
        getSnapshot(e) {
            return this.snapshots.get(e) || null;
        }
        clear() {
            this.history = [], this.currentIndex = -1, this.snapshots.clear(), console.log("🧹 Command history cleared");
        }
        setMaxHistorySize(e) {
            if (this.maxHistorySize = Math.max(1, e), this.history.length > this.maxHistorySize) {
                const t = this.history.length - this.maxHistorySize;
                this.history.splice(0, t), this.currentIndex -= t;
            }
        }
        get isOperating() {
            return this.isUndoing || this.isRedoing;
        }
        logState() {
            const e = this.canUndo(), t = this.canRedo(), o = this.getUndoDescription(), i = this.getRedoDescription();
            console.log(`📊 History: ${this.currentIndex + 1}/${this.history.length}`), console.log(`   Undo: ${e ? `✅ ${o}` : "❌ Nothing"}`), console.log(`   Redo: ${t ? `✅ ${i}` : "❌ Nothing"}`);
        }
        createVersionSnapshot(e, t, o) {
            const i = {
                id: this.generateSnapshotId(),
                timestamp: Date.now(),
                data: JSON.parse(JSON.stringify(t)),
                type: e
            };
            return this.versionSnapshots.push(i), this.versionSnapshots.length > this.maxVersionSnapshots && this.versionSnapshots.shift(), console.log(`📸 Version snapshot criado: ${e} (${o || "sem descrição"})`), i;
        }
        async restoreVersionSnapshot(e) {
            const t = this.versionSnapshots.find((o)=>o.id === e);
            if (!t) throw new Error(`Snapshot ${e} não encontrado`);
            return console.log(`↩️ Restaurando snapshot: ${t.type}`), a.emit(r.VERSION_RESTORE, {
                snapshotId: e,
                snapshot: t
            }), t.data;
        }
        getVersionSnapshots() {
            return [
                ...this.versionSnapshots
            ];
        }
        removeVersionSnapshot(e) {
            const t = this.versionSnapshots.findIndex((o)=>o.id === e);
            return t === -1 ? !1 : (this.versionSnapshots.splice(t, 1), !0);
        }
        compareSnapshots(e, t) {
            const o = this.versionSnapshots.find((u)=>u.id === e), i = this.versionSnapshots.find((u)=>u.id === t);
            return !o || !i ? null : {
                snapshot1: o,
                snapshot2: i,
                timeDiff: i.timestamp - o.timestamp,
                changes: this.calculateBasicDiff(o.data, i.data)
            };
        }
        calculateBasicDiff(e, t) {
            const o = [], i = Object.keys(e), u = Object.keys(t);
            for (const c of u)c in e || o.push({
                type: "added",
                key: c,
                value: t[c]
            });
            for (const c of i)c in t || o.push({
                type: "removed",
                key: c,
                oldValue: e[c]
            });
            for (const c of i)c in t && e[c] !== t[c] && o.push({
                type: "modified",
                key: c,
                oldValue: e[c],
                newValue: t[c]
            });
            return o;
        }
        generateSnapshotId() {
            return `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        getStats() {
            return {
                totalCommands: this.history.length,
                currentIndex: this.currentIndex,
                canUndo: this.canUndo(),
                canRedo: this.canRedo(),
                undoStackSize: this.currentIndex + 1,
                redoStackSize: this.history.length - this.currentIndex - 1,
                snapshotsCount: this.snapshots.size
            };
        }
    }
    const N = v.getInstance();
    function ae() {
        return null;
    }
    function ce() {
        return null;
    }
    function le() {
        return null;
    }
    function de() {
        return null;
    }
    function U() {
        ue(), he(), ge(), Ee(), pe(), me(), fe(), ye(), Oe(), console.log("✅ All command handlers registered");
    }
    function ue() {
        h.register({
            id: n.FILE_NEW,
            label: "New Project",
            category: "file",
            shortcut: "Ctrl+N"
        }, async (s)=>{
            if (console.log("📄 Creating new project..."), E.getState().projectContext.modelLoaded && !window.confirm("Are you sure? Unsaved changes will be lost.")) return;
            const t = s?.template || "empty";
            E.projectManager.reset(), E.selectionManager.deselectAll(), E.layerManager.clearLayers(), N.clear(), a.emit(r.PROJECT_RESET, {
                template: t
            }), console.log(`✅ New project created (template: ${t})`);
        }), h.register({
            id: n.FILE_OPEN,
            label: "Open",
            category: "file",
            shortcut: "Ctrl+O"
        }, async ()=>{
            console.log("📂 Opening file dialog...");
            const s = document.createElement("input");
            s.type = "file", s.accept = ".ifc,.gltf,.glb,.obj,.fbx,.arxis.json", s.onchange = (e)=>{
                const t = e.target.files?.[0];
                if (!t) return;
                const o = t.name.split(".").pop()?.toLowerCase();
                let i = "ifc";
                o === "gltf" || o === "glb" ? i = "gltf" : o === "obj" || o === "fbx" ? i = "obj" : t.name.includes(".arxis.json") && (i = "project"), a.emit(r.FILE_SELECTED, {
                    file: t,
                    kind: i
                }), i === "project" ? C.loadFromFile(t).then((u)=>{
                    a.emit(r.PROJECT_LOADED, {
                        projectData: u
                    });
                }).catch((u)=>{
                    console.error("Failed to load project:", u), alert("Failed to load project: " + u.message);
                }) : a.emit(r.MODEL_LOAD_REQUESTED, {
                    kind: i,
                    source: "file",
                    fileRef: t
                });
            }, s.click();
        }), h.register({
            id: n.FILE_OPEN_IFC,
            label: "Open IFC",
            category: "file"
        }, async ()=>{
            console.log("🏗️ Opening IFC file...");
            const s = document.createElement("input");
            s.type = "file", s.accept = ".ifc", s.onchange = (e)=>{
                const t = e.target.files?.[0];
                t && (a.emit(r.FILE_SELECTED, {
                    file: t,
                    kind: "ifc"
                }), a.emit(r.MODEL_LOAD_REQUESTED, {
                    kind: "ifc",
                    source: "file",
                    fileRef: t
                }));
            }, s.click();
        }), h.register({
            id: n.FILE_OPEN_GLTF,
            label: "Open GLTF/GLB",
            category: "file"
        }, async ()=>{
            console.log("📦 Opening GLTF file...");
            const s = document.createElement("input");
            s.type = "file", s.accept = ".gltf,.glb", s.onchange = (e)=>{
                const t = e.target.files?.[0];
                t && (a.emit(r.FILE_SELECTED, {
                    file: t,
                    kind: "gltf"
                }), a.emit(r.MODEL_LOAD_REQUESTED, {
                    kind: "gltf",
                    source: "file",
                    fileRef: t
                }));
            }, s.click();
        }), h.register({
            id: n.FILE_OPEN_OBJ,
            label: "Open OBJ/FBX",
            category: "file"
        }, async ()=>{
            console.log("🗿 Opening OBJ file...");
            const s = document.createElement("input");
            s.type = "file", s.accept = ".obj,.fbx", s.onchange = (e)=>{
                const t = e.target.files?.[0];
                t && (a.emit(r.FILE_SELECTED, {
                    file: t,
                    kind: "obj"
                }), a.emit(r.MODEL_LOAD_REQUESTED, {
                    kind: "obj",
                    source: "file",
                    fileRef: t
                }));
            }, s.click();
        }), h.register({
            id: n.FILE_SAVE,
            label: "Save",
            category: "file",
            shortcut: "Ctrl+S"
        }, async ()=>{
            console.log("💾 Saving project...");
            const s = E.sceneManager, e = E.cameraSystem;
            if (!s || !e) {
                console.error("❌ Scene or camera not available");
                return;
            }
            const t = C.serialize(s.scene, e.camera, "ArxisVR Project");
            C.saveToFile(t), a.emit(r.PROJECT_SAVE, {}), console.log("✅ Project saved successfully");
        }), h.register({
            id: n.FILE_SAVE_AS,
            label: "Save As",
            category: "file",
            shortcut: "Ctrl+Shift+S"
        }, async ()=>{
            console.log("💾 Save As...");
            const s = prompt("Project name:", "ArxisVR Project");
            if (!s) return;
            const e = E.sceneManager, t = E.cameraSystem;
            if (!e || !t) {
                console.error("❌ Scene or camera not available");
                return;
            }
            const o = C.serialize(e.scene, t.camera, s);
            C.saveToFile(o, `${s}.arxis.json`), a.emit(r.PROJECT_SAVE_AS, {}), console.log("✅ Project saved as successfully");
        }), h.register({
            id: n.FILE_EXPORT_GLB,
            label: "Export Scene as GLB",
            category: "file"
        }, async (s)=>{
            console.log("📤 Exporting GLB..."), a.emit(r.EXPORT_GLB_REQUESTED, {
                selection: s?.selection || !1
            }), console.log("⚠️ GLB export not fully implemented yet");
        }), h.register({
            id: n.FILE_EXPORT_SELECTION,
            label: "Export Selection",
            category: "file"
        }, async ()=>{
            console.log("📤 Exporting selection..."), a.emit(r.EXPORT_GLB_REQUESTED, {
                selection: !0
            }), console.log("⚠️ Selection export not fully implemented yet");
        }), h.register({
            id: n.FILE_EXPORT_SCREENSHOT,
            label: "Export Screenshot",
            category: "file",
            shortcut: "Ctrl+P"
        }, async (s)=>{
            console.log("📸 Taking screenshot...");
            try {
                const e = await A(()=>import("./index-DbWvsKsa.js").then(async (m)=>{
                        await m.__tla;
                        return m;
                    }).then((u)=>u.t), __vite__mapDeps([0,1])), t = document.querySelector("canvas");
                if (!t) throw new Error("Canvas not found");
                const o = s?.width || t.width, i = s?.height || t.height;
                t.toBlob((u)=>{
                    if (!u) {
                        console.error("❌ Failed to create blob");
                        return;
                    }
                    const c = document.createElement("a"), g = `arxisvr-screenshot-${Date.now()}.png`;
                    c.download = g, c.href = URL.createObjectURL(u), c.click(), setTimeout(()=>URL.revokeObjectURL(c.href), 100), a.emit(r.EXPORT_COMPLETED, {
                        type: "screenshot",
                        filename: g
                    }), console.log(`✅ Screenshot saved: ${g}`);
                }, "image/png");
            } catch (e) {
                console.error("❌ Screenshot failed:", e), a.emit(r.EXPORT_FAILED, {
                    type: "screenshot",
                    error: e.message
                }), a.emit(r.EXPORT_FAILED, {
                    type: "screenshot",
                    error: String(e)
                });
            }
        }), h.register({
            id: n.FILE_CLOSE,
            label: "Close",
            category: "file",
            shortcut: "Ctrl+W"
        }, async ()=>{
            console.log("❌ Closing project..."), a.emit(r.PROJECT_CLOSE, {});
        });
    }
    function he() {
        h.register({
            id: n.EDIT_UNDO,
            label: "Undo",
            category: "edit",
            shortcut: "Ctrl+Z"
        }, async ()=>{
            console.log("↶ Undo"), await N.undo() || console.warn("⚠️ Nothing to undo");
        }), h.register({
            id: n.EDIT_REDO,
            label: "Redo",
            category: "edit",
            shortcut: "Ctrl+Y"
        }, async ()=>{
            console.log("↷ Redo"), await N.redo() || console.warn("⚠️ Nothing to redo");
        }), h.register({
            id: n.EDIT_CUT,
            label: "Cut",
            category: "edit",
            shortcut: "Ctrl+X"
        }, async ()=>{
            console.log("✂️ Cut");
            const s = E.getState();
            s.selectedObjects.length > 0 && a.emit(r.EDIT_CUT, {
                objects: s.selectedObjects.map((e)=>e.object.uuid)
            });
        }), h.register({
            id: n.EDIT_COPY,
            label: "Copy",
            category: "edit",
            shortcut: "Ctrl+C"
        }, async ()=>{
            console.log("📋 Copy");
            const s = E.getState();
            s.selectedObjects.length > 0 && a.emit(r.EDIT_COPY, {
                objects: s.selectedObjects.map((e)=>e.object.uuid)
            });
        }), h.register({
            id: n.EDIT_PASTE,
            label: "Paste",
            category: "edit",
            shortcut: "Ctrl+V"
        }, async ()=>{
            console.log("📌 Paste"), a.emit(r.EDIT_PASTE, {});
        }), h.register({
            id: n.EDIT_DELETE,
            label: "Delete",
            category: "edit",
            shortcut: "Delete"
        }, async ()=>{
            console.log("🗑️ Delete");
            const s = E.getState();
            s.selectedObjects.length > 0 && a.emit(r.EDIT_DELETE, {
                objects: s.selectedObjects.map((e)=>e.object.uuid)
            });
        }), h.register({
            id: n.EDIT_SELECT_ALL,
            label: "Select All",
            category: "edit",
            shortcut: "Ctrl+A"
        }, async ()=>{
            console.log("✅ Select All"), a.emit(r.SELECT_ALL, {});
        }), h.register({
            id: n.EDIT_DESELECT_ALL,
            label: "Deselect All",
            category: "edit",
            shortcut: "Ctrl+D"
        }, async ()=>{
            console.log("⬜ Deselect All"), a.emit(r.DESELECT_ALL, {});
        });
    }
    function ge() {
        h.register({
            id: n.VIEW_TOP,
            label: "Top View",
            category: "view"
        }, async ()=>{
            console.log("⬆️ Top View"), a.emit(r.CAMERA_VIEW_CHANGE, {
                view: "top"
            });
        }), h.register({
            id: n.VIEW_FRONT,
            label: "Front View",
            category: "view"
        }, async ()=>{
            console.log("➡️ Front View"), a.emit(r.CAMERA_VIEW_CHANGE, {
                view: "front"
            });
        }), h.register({
            id: n.VIEW_SIDE,
            label: "Side View",
            category: "view"
        }, async ()=>{
            console.log("⬅️ Side View"), a.emit(r.CAMERA_VIEW_CHANGE, {
                view: "side"
            });
        }), h.register({
            id: n.VIEW_ISOMETRIC,
            label: "Isometric View",
            category: "view"
        }, async ()=>{
            console.log("📐 Isometric View"), a.emit(r.CAMERA_VIEW_CHANGE, {
                view: "isometric"
            });
        }), h.register({
            id: n.VIEW_FOCUS_SELECTION,
            label: "Focus Selection",
            category: "view",
            shortcut: "F"
        }, async ()=>{
            console.log("🎯 Focus Selection"), a.emit(r.CAMERA_FOCUS_SELECTION, {});
        }), h.register({
            id: n.VIEW_FRAME_ALL,
            label: "Frame All",
            category: "view",
            shortcut: "H"
        }, async ()=>{
            console.log("🖼️ Frame All"), a.emit(r.CAMERA_FRAME_ALL, {});
        }), h.register({
            id: n.VIEW_TOGGLE_GRID,
            label: "Toggle Grid",
            category: "view",
            shortcut: "G"
        }, async ()=>{
            console.log("#️⃣ Toggle Grid");
            const s = window.toggleGrid?.();
            console.log(`Grid ${s ? "ativado" : "desativado"}`);
        }), h.register({
            id: n.VIEW_TOGGLE_AXES,
            label: "Toggle Axes",
            category: "view",
            shortcut: "X"
        }, async ()=>{
            console.log("📍 Toggle Axes"), a.emit(r.VIEW_TOGGLE_AXES, {});
        }), h.register({
            id: n.VIEW_TOGGLE_STATS,
            label: "Toggle Stats",
            category: "view",
            shortcut: "Shift+S"
        }, async ()=>{
            console.log("📊 Toggle Stats");
            const e = !E.getState().viewState.statsEnabled;
            E.getState().setStatsEnabled(e), a.emit(r.VIEW_TOGGLE_STATS, {
                enabled: e
            }), E.notifyStateChange?.();
        }), h.register({
            id: n.VIEW_FULLSCREEN,
            label: "Fullscreen",
            category: "view",
            shortcut: "F11"
        }, async ()=>{
            console.log("⛶ Toggle Fullscreen"), document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
        }), h.register({
            id: n.VIEW_SET_RENDER_QUALITY,
            label: "Set Render Quality",
            category: "view"
        }, async (s)=>{
            const e = s?.quality;
            if (!e) {
                console.warn("⚠️ No quality specified");
                return;
            }
            console.log(`🎨 Setting render quality: ${e}`), E.setRenderQuality(e), console.log("✅ Render quality updated");
        }), h.register({
            id: n.VIEW_SET_CAMERA_MODE,
            label: "Set Camera Mode",
            category: "view"
        }, async (s)=>{
            const e = s?.mode;
            if (!e) {
                console.warn("⚠️ No camera mode specified");
                return;
            }
            console.log(`📷 Setting camera mode: ${e}`), E.getState().setCameraMode(e), a.emit(r.CAMERA_MODE_CHANGED, {
                mode: e
            }), console.log("✅ Camera mode updated");
        });
    }
    function Ee() {
        h.register({
            id: n.MODEL_SHOW_ALL,
            label: "Show All",
            category: "model"
        }, async ()=>{
            console.log("👁️ Show All"), a.emit(r.MODEL_SHOW_ALL, {});
        }), h.register({
            id: n.MODEL_HIDE_SELECTED,
            label: "Hide Selected",
            category: "model"
        }, async ()=>{
            console.log("🙈 Hide Selected");
            const s = E.getState();
            s.selectedObjects.length > 0 && a.emit(r.MODEL_HIDE_SELECTED, {
                objects: s.selectedObjects.map((e)=>e.object.uuid)
            });
        }), h.register({
            id: n.MODEL_ISOLATE_SELECTED,
            label: "Isolate Selected",
            category: "model"
        }, async ()=>{
            console.log("🔒 Isolate Selected");
            const s = E.getState();
            s.selectedObjects.length > 0 && a.emit(r.MODEL_ISOLATE_SELECTED, {
                objects: s.selectedObjects.map((e)=>e.object.uuid)
            });
        }), h.register({
            id: n.MODEL_HIDE_BY_CLASS,
            label: "Hide by Class",
            category: "model"
        }, async (s)=>{
            console.log("🏗️ Hide by Class:", s), s?.ifcClass && a.emit(r.MODEL_HIDE_BY_CLASS, {
                ifcClass: s.ifcClass
            });
        });
    }
    function pe() {
        h.register({
            id: n.TOOL_SELECT,
            label: "Selection Tool",
            category: "tool",
            shortcut: "Q"
        }, async ()=>{
            console.log("👆 Selection Tool"), E.toolManager?.setActiveTool("selection");
        }), h.register({
            id: n.TOOL_MEASURE,
            label: "Measurement Tool",
            category: "tool",
            shortcut: "E"
        }, async ()=>{
            console.log("📏 Measurement Tool"), E.toolManager?.setActiveTool("measurement");
        }), h.register({
            id: n.TOOL_LAYER,
            label: "Layer Tool",
            category: "tool",
            shortcut: "R"
        }, async ()=>{
            console.log("📚 Layer Tool"), E.toolManager?.setActiveTool("layer");
        });
    }
    function me() {
        let s = null;
        const e = async ()=>(s || (s = A(()=>import("./index-DeyKvnV-.js"), __vite__mapDeps([2,0,1])).then((t)=>t.xrManager)), s);
        h.register({
            id: n.XR_ENTER,
            label: "Enter VR",
            category: "xr",
            shortcut: "V"
        }, async ()=>{
            console.log("🥽 Enter VR");
            try {
                await (await e()).enterXR("vr");
            } catch (t) {
                console.error("Failed to enter VR:", t), alert("Failed to enter VR: " + t.message);
            }
        }), h.register({
            id: n.XR_EXIT,
            label: "Exit VR",
            category: "xr"
        }, async ()=>{
            console.log("🥽 Exit VR");
            try {
                await (await e()).exitXR();
            } catch (t) {
                console.error("Failed to exit VR:", t);
            }
        }), h.register({
            id: n.XR_TOGGLE,
            label: "Toggle VR",
            category: "xr",
            shortcut: "Shift+V"
        }, async ()=>{
            console.log("🥽 Toggle VR");
            try {
                const t = await e();
                t.isActive ? await t.exitXR() : await t.enterXR("vr");
            } catch (t) {
                console.error("Failed to toggle VR:", t), alert("Failed to toggle VR: " + t.message);
            }
        });
    }
    function fe() {
        let s = null;
        const e = async ()=>(s || (s = A(()=>import("./index-i17IXJTz.js"), __vite__mapDeps([3,0,1])).then((t)=>t.networkManager)), s);
        h.register({
            id: n.NET_CONNECT,
            label: "Connect Multiplayer",
            category: "network"
        }, async (t)=>{
            if (console.log("🌐 Connect Multiplayer"), t?.serverUrl && t?.playerName) try {
                await (await e()).connect(t.serverUrl, t.playerName), console.log("✅ Connected to multiplayer");
            } catch (o) {
                console.error("Failed to connect:", o), alert("Failed to connect: " + o.message);
            }
            else ce().open();
        }), h.register({
            id: n.NET_DISCONNECT,
            label: "Disconnect",
            category: "network"
        }, async ()=>{
            console.log("🌐 Disconnect");
            try {
                (await e()).disconnect(), console.log("✅ Disconnected from multiplayer");
            } catch (t) {
                console.error("Failed to disconnect:", t);
            }
        }), h.register({
            id: n.NET_CREATE_ROOM,
            label: "Create Room",
            category: "network"
        }, async (t)=>{
            console.log("🚪 Create Room");
            const o = t?.roomName || prompt("Room name:", "ArxisVR Room");
            o && a.emit(r.NET_CREATE_ROOM_REQUESTED, {
                roomName: o
            });
        }), h.register({
            id: n.NET_JOIN_ROOM,
            label: "Join Room",
            category: "network"
        }, async (t)=>{
            console.log("🚪 Join Room");
            const o = t?.roomId || prompt("Room ID:");
            o && a.emit(r.NET_JOIN_ROOM_REQUESTED, {
                roomId: o
            });
        }), h.register({
            id: n.NET_LEAVE_ROOM,
            label: "Leave Room",
            category: "network"
        }, async ()=>{
            console.log("🚪 Leave Room"), a.emit(r.ROOM_LEFT, {});
        });
    }
    function ye() {
        h.register({
            id: n.THEME_SELECT,
            label: "Select Theme",
            category: "theme"
        }, async ()=>{
            console.log("🎨 Opening theme selector..."), ae().show();
        });
    }
    function Oe() {
        h.register({
            id: n.HELP_DOCS,
            label: "Documentation",
            category: "help",
            shortcut: "F1"
        }, async ()=>{
            console.log("📚 Opening documentation..."), window.open("https://github.com/avilaops/arxisVR#readme", "_blank");
        }), h.register({
            id: n.HELP_SHORTCUTS,
            label: "Keyboard Shortcuts",
            category: "help"
        }, async ()=>{
            console.log("⌨️ Showing shortcuts..."), le().open();
        }), h.register({
            id: n.HELP_ABOUT,
            label: "About",
            category: "help"
        }, async ()=>{
            console.log("ℹ️ Showing about..."), de().open();
        }), h.register({
            id: n.AI_TOGGLE_CHAT,
            label: "Toggle AI Chat",
            category: "ai",
            shortcut: "Ctrl+K"
        }, async ()=>{
            console.log("🤖 Toggle AI Chat"), a.emit(r.AI_CHAT_TOGGLE, {});
        });
    }
    const Te = Object.freeze(Object.defineProperty({
        __proto__: null,
        CommandId: n,
        CommandRegistry: T,
        commandRegistry: h,
        registerAllCommandHandlers: U
    }, Symbol.toStringTag, {
        value: "Module"
    }));
    var d = ((s)=>(s.ACTION = "action", s.TOGGLE = "toggle", s.RADIO_GROUP = "radio", s.SUBMENU = "submenu", s.SEPARATOR = "separator", s))(d || {});
    const ve = {
        "Ctrl+O": n.FILE_OPEN,
        "Ctrl+S": n.FILE_SAVE,
        "Ctrl+Shift+S": n.FILE_SAVE_AS,
        "Ctrl+W": n.FILE_CLOSE,
        "Ctrl+Z": n.EDIT_UNDO,
        "Ctrl+Y": n.EDIT_REDO,
        "Ctrl+Shift+Z": n.EDIT_REDO,
        "Ctrl+X": n.EDIT_CUT,
        "Ctrl+C": n.EDIT_COPY,
        "Ctrl+V": n.EDIT_PASTE,
        Delete: n.EDIT_DELETE,
        "Ctrl+A": n.EDIT_SELECT_ALL,
        "Ctrl+D": n.EDIT_DESELECT_ALL,
        F: n.VIEW_FOCUS_SELECTION,
        H: n.VIEW_FRAME_ALL,
        G: n.VIEW_TOGGLE_GRID,
        X: n.VIEW_TOGGLE_AXES,
        F11: n.VIEW_FULLSCREEN,
        Q: n.TOOL_SELECT,
        W: n.TOOL_NAVIGATE,
        E: n.TOOL_MEASURE,
        R: n.TOOL_LAYER,
        "Ctrl+K": n.AI_TOGGLE_CHAT,
        F1: n.HELP_DOCS,
        "Ctrl+/": n.HELP_SHORTCUTS
    };
    class S {
        static instance;
        topLevelMenus = new Map;
        contextMenus = new Map;
        modals = new Map;
        state = {
            activeMenuId: null,
            activeSubmenuId: null,
            contextMenuVisible: !1,
            modalStack: []
        };
        config = {
            shortcuts: !0,
            animations: !0,
            closeOnClickOutside: !0,
            closeOnEsc: !0,
            hoverDelay: 300
        };
        shortcuts = {
            ...ve
        };
        constructor(){
            this.setupEventListeners(), this.setupKeyboardShortcuts(), console.log("📋 MenuManager initialized");
        }
        static getInstance() {
            return S.instance || (S.instance = new S), S.instance;
        }
        registerTopLevelMenu(e) {
            this.topLevelMenus.set(e.id, e), console.log(`✅ Top-level menu registered: ${e.id}`);
        }
        unregisterTopLevelMenu(e) {
            this.topLevelMenus.delete(e), console.log(`❌ Top-level menu unregistered: ${e}`);
        }
        getTopLevelMenus() {
            return Array.from(this.topLevelMenus.values()).sort((e, t)=>(e.order || 0) - (t.order || 0));
        }
        getMenu(e) {
            return this.topLevelMenus.get(e);
        }
        openMenu(e) {
            this.state.activeMenuId !== e && (this.closeMenu(), this.state.activeMenuId = e, a.emit(r.MENU_OPENED, {
                menuId: e
            }));
        }
        closeMenu() {
            if (this.state.activeMenuId) {
                const e = this.state.activeMenuId;
                this.state.activeMenuId = null, this.state.activeSubmenuId = null, a.emit(r.MENU_CLOSED, {
                    menuId: e
                });
            }
        }
        toggleMenu(e) {
            this.state.activeMenuId === e ? this.closeMenu() : this.openMenu(e);
        }
        getState() {
            return {
                ...this.state
            };
        }
        isMenuOpen(e) {
            return this.state.activeMenuId === e;
        }
        showContextMenu(e, t, o) {
            this.contextMenus.set(e.id, {
                ...e,
                position: {
                    x: t,
                    y: o
                }
            }), this.state.contextMenuVisible = !0, a.emit(r.MENU_OPENED, {
                menuId: e.id
            });
        }
        closeContextMenu() {
            this.contextMenus.clear(), this.state.contextMenuVisible = !1;
        }
        getActiveContextMenu() {
            return Array.from(this.contextMenus.values())[0] || null;
        }
        showModal(e) {
            this.modals.set(e.id, e), this.state.modalStack.push(e.id), a.emit(r.MENU_OPENED, {
                menuId: e.id
            });
        }
        closeModal(e) {
            const t = this.modals.get(e);
            if (t) {
                t.onClose?.(), this.modals.delete(e);
                const o = this.state.modalStack.indexOf(e);
                o > -1 && this.state.modalStack.splice(o, 1), a.emit(r.MENU_CLOSED, {
                    menuId: e
                });
            }
        }
        closeTopModal() {
            const e = this.state.modalStack[this.state.modalStack.length - 1];
            e && this.closeModal(e);
        }
        getTopModal() {
            const e = this.state.modalStack[this.state.modalStack.length - 1];
            return e && this.modals.get(e) || null;
        }
        async executeMenuItem(e) {
            switch(a.emit(r.MENU_ITEM_CLICKED, {
                menuId: this.state.activeMenuId || "unknown",
                itemId: e.id
            }), e.type){
                case d.ACTION:
                    {
                        const t = e;
                        this.closeMenu(), await h.execute(t.commandId, t.payload);
                        break;
                    }
                case d.TOGGLE:
                    {
                        const t = e;
                        t.checked = !t.checked, t.onChange && await t.onChange(t.checked), t.commandId && await h.execute(t.commandId, {
                            checked: t.checked
                        });
                        break;
                    }
                case d.RADIO_GROUP:
                    {
                        const t = e;
                        t.onChange && await t.onChange(t.selected);
                        break;
                    }
                case d.SUBMENU:
                    {
                        this.state.activeSubmenuId = e.id;
                        break;
                    }
                case d.SEPARATOR:
                    break;
            }
        }
        updateMenuItem(e, t, o) {
            const i = this.topLevelMenus.get(e);
            if (!i) return;
            const u = this.findMenuItem(i.items, t);
            u && Object.assign(u, o);
        }
        findMenuItem(e, t) {
            for (const o of e){
                if (o.id === t) return o;
                if (o.type === d.SUBMENU) {
                    const i = this.findMenuItem(o.items, t);
                    if (i) return i;
                }
            }
            return null;
        }
        updateMenuStates(e) {
            this.topLevelMenus.forEach((t)=>{
                this.updateMenuItemStates(t.items, e);
            });
        }
        updateMenuItemStates(e, t) {
            e.forEach((o)=>{
                if (o.enabledWhen && (o.enabled = o.enabledWhen(t)), o.visibleWhen && (o.visible = o.visibleWhen(t)), o.labelProvider && (o.label = o.labelProvider(t)), o.iconProvider && (o.icon = o.iconProvider(t)), o.type === d.TOGGLE) {
                    const i = o;
                    i.checkedWhen && (i.checked = i.checkedWhen(t));
                }
                o.type === d.SUBMENU && this.updateMenuItemStates(o.items, t);
            });
        }
        getMenuItem(e, t, o) {
            const i = this.topLevelMenus.get(e);
            if (!i) return null;
            const u = this.findMenuItem(i.items, t);
            if (!u) return null;
            if (o) {
                const c = {
                    ...u
                };
                return c.enabledWhen && (c.enabled = c.enabledWhen(o)), c.visibleWhen && (c.visible = c.visibleWhen(o)), c.labelProvider && (c.label = c.labelProvider(o)), c.iconProvider && (c.icon = c.iconProvider(o)), c;
            }
            return u;
        }
        setupKeyboardShortcuts() {
            this.config.shortcuts && (document.addEventListener("keydown", async (e)=>{
                const { isTypingInUI: t } = await A(async ()=>{
                    const { isTypingInUI: g } = await import("./components-registry-Db1_yPMN.js");
                    return {
                        isTypingInUI: g
                    };
                }, []);
                if (t()) return;
                const o = [];
                e.ctrlKey && o.push("Ctrl"), e.shiftKey && o.push("Shift"), e.altKey && o.push("Alt");
                let i = e.key;
                i === " " && (i = "Space"), i === "?" && (i = "/"), i.length === 1 && (i = i.toUpperCase()), o.push(i);
                const u = o.join("+"), c = this.shortcuts[u];
                c && (e.preventDefault(), e.stopPropagation(), h.execute(c));
            }), console.log("⌨️  Keyboard shortcuts enabled"));
        }
        registerShortcut(e, t) {
            this.shortcuts[e] = t;
        }
        unregisterShortcut(e) {
            delete this.shortcuts[e];
        }
        getShortcuts() {
            return {
                ...this.shortcuts
            };
        }
        setupEventListeners() {
            this.config.closeOnEsc && document.addEventListener("keydown", (e)=>{
                e.key === "Escape" && (this.state.modalStack.length > 0 ? this.closeTopModal() : this.state.contextMenuVisible ? this.closeContextMenu() : this.state.activeMenuId && this.closeMenu());
            }), this.config.closeOnClickOutside && document.addEventListener("click", (e)=>{
                const t = e.target;
                !t.closest(".menu-dropdown") && !t.closest(".menu-button") && this.state.activeMenuId && this.closeMenu(), t.closest(".context-menu") || this.state.contextMenuVisible && this.closeContextMenu();
            });
        }
        updateConfig(e) {
            Object.assign(this.config, e);
        }
        getConfig() {
            return {
                ...this.config
            };
        }
        clear() {
            this.topLevelMenus.clear(), this.contextMenus.clear(), this.modals.clear(), this.state = {
                activeMenuId: null,
                activeSubmenuId: null,
                contextMenuVisible: !1,
                modalStack: []
            };
        }
        dispose() {
            this.clear(), console.log("MenuManager disposed");
        }
    }
    const Se = S.getInstance();
    d.ACTION, n.FILE_NEW, d.SUBMENU, d.ACTION, n.FILE_OPEN_IFC, d.ACTION, n.FILE_OPEN_GLTF, d.ACTION, n.FILE_OPEN_OBJ, d.SEPARATOR, d.ACTION, n.FILE_OPEN, d.SEPARATOR, d.ACTION, n.FILE_SAVE, d.ACTION, n.FILE_SAVE_AS, d.SEPARATOR, d.SUBMENU, d.ACTION, n.FILE_EXPORT_GLB, d.ACTION, n.FILE_EXPORT_SELECTION, d.SEPARATOR, d.ACTION, n.FILE_EXPORT_SCREENSHOT, d.SEPARATOR, d.ACTION, n.FILE_CLOSE;
    d.ACTION, n.EDIT_UNDO, d.ACTION, n.EDIT_REDO, d.SEPARATOR, d.ACTION, n.EDIT_CUT, d.ACTION, n.EDIT_COPY, d.ACTION, n.EDIT_PASTE, d.ACTION, n.EDIT_DELETE, d.SEPARATOR, d.ACTION, n.EDIT_SELECT_ALL, d.ACTION, n.EDIT_DESELECT_ALL;
    d.SUBMENU, d.ACTION, n.VIEW_TOP, d.ACTION, n.VIEW_FRONT, d.ACTION, n.VIEW_SIDE, d.ACTION, n.VIEW_ISOMETRIC, d.ACTION, n.VIEW_FOCUS_SELECTION, d.ACTION, n.VIEW_FRAME_ALL, d.SEPARATOR, d.TOGGLE, n.VIEW_TOGGLE_GRID, d.TOGGLE, n.VIEW_TOGGLE_AXES, d.TOGGLE, n.VIEW_TOGGLE_STATS, d.SEPARATOR, d.ACTION, n.VIEW_FULLSCREEN;
    d.ACTION, n.MODEL_SHOW_ALL, d.ACTION, n.MODEL_HIDE_SELECTED, d.ACTION, n.MODEL_ISOLATE_SELECTED, d.SEPARATOR, d.SUBMENU, d.ACTION, n.MODEL_SHOW_BY_CLASS, d.ACTION, n.MODEL_SHOW_BY_CLASS, d.ACTION, n.MODEL_SHOW_BY_CLASS, d.SEPARATOR, d.ACTION, n.MODEL_PROPERTIES;
    d.ACTION, n.TOOL_SELECT, d.ACTION, n.TOOL_NAVIGATE, d.ACTION, n.TOOL_MEASURE, d.ACTION, n.TOOL_LAYER;
    d.ACTION, n.XR_TOGGLE;
    d.ACTION, n.NET_CONNECT, d.SEPARATOR, d.ACTION, n.NET_CREATE_ROOM, d.ACTION, n.NET_JOIN_ROOM, d.ACTION, n.NET_LEAVE_ROOM;
    d.ACTION, n.HELP_DOCS, d.ACTION, n.HELP_SHORTCUTS, d.SEPARATOR, d.ACTION, n.HELP_ABOUT;
    _ = class {
        static instance;
        toolManager;
        projectManager;
        projectSerializer;
        selectionManager;
        navigationManager;
        layerManager;
        sectionManager;
        ifcPropertyService;
        ifcLoader = null;
        _renderer = null;
        constructor(){
            this.toolManager = new ee, this.projectManager = new te, this.projectSerializer = O.getInstance(), this.selectionManager = new oe, this.navigationManager = new se, this.layerManager = new ie, this.sectionManager = new k(Z()), this.ifcPropertyService = re, U(), this.setupEventListeners(), this.initializeDefaultState(), console.log("✅ AppController initialized");
        }
        static getInstance() {
            return _.instance || (_.instance = new _), _.instance;
        }
        setEngineReferences(e, t, o, i) {
            this._renderer = o ?? null, this.layerManager.setScene(e), this.ifcLoader = i || null, this.sectionManager = new k(e, o ?? null), console.log("✂️ SectionManager configured with real scene and renderer"), i && (this.ifcPropertyService.setIFCLoader(i), console.log("🔍 IFCPropertyService configured with IFCLoader"));
        }
        initializeDefaultState() {
            l.setNavigationMode(f.FLY), l.setActiveTool(m.NONE);
        }
        getState() {
            return l;
        }
        activateTool(e) {
            return this.toolManager.activateTool(e);
        }
        deactivateTool() {
            this.toolManager.deactivateTool();
        }
        getActiveTool() {
            return this.toolManager.getActiveToolType();
        }
        selectObject(e, t) {
            this.selectionManager.selectObject(e, t);
        }
        deselectObject() {
            this.selectionManager.deselectObject();
        }
        getSelectedObject() {
            return this.selectionManager.getSelectedObject();
        }
        setNavigationMode(e) {
            this.navigationManager.setNavigationMode(e);
        }
        toggleNavigationMode() {
            this.navigationManager.toggleNavigationMode();
        }
        getNavigationMode() {
            return this.navigationManager.getNavigationMode();
        }
        createLayer(e, t, o) {
            return this.layerManager.createLayer(e, t, o);
        }
        toggleLayerVisibility(e) {
            this.layerManager.toggleLayerVisibility(e);
        }
        getLayers() {
            return this.layerManager.getLayers();
        }
        createNewProject(e) {
            this.projectManager.createNewProject(e);
        }
        getProjectInfo() {
            return this.projectManager.getProjectInfo();
        }
        setRenderQuality(e) {
            l.graphicsSettings.quality !== e && (l.updateGraphicsSettings({
                quality: e
            }), a.emit(r.RENDER_QUALITY_CHANGED, {
                quality: e
            }), this.applyRenderQualitySettings(e), this.notifyStateChange());
        }
        applyRenderQualitySettings(e) {
            if (this._renderer) switch(e){
                case b.LOW:
                    this._renderer.setPixelRatio(1), this._renderer.shadowMap.enabled = !1;
                    break;
                case b.MEDIUM:
                    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)), this._renderer.shadowMap.enabled = !0, this._renderer.shadowMap.type = THREE.BasicShadowMap;
                    break;
                case b.HIGH:
                    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)), this._renderer.shadowMap.enabled = !0, this._renderer.shadowMap.type = THREE.PCFShadowMap;
                    break;
                case b.ULTRA:
                    this._renderer.setPixelRatio(window.devicePixelRatio), this._renderer.shadowMap.enabled = !0, this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                    break;
            }
        }
        toggleShadows() {
            const t = !l.graphicsSettings.shadowsEnabled;
            l.updateGraphicsSettings({
                shadowsEnabled: t
            }), this._renderer && (this._renderer.shadowMap.enabled = t), a.emit(r.RENDER_SETTINGS_CHANGED, {
                settings: {
                    shadowsEnabled: t
                }
            });
        }
        notifyStateChange() {
            const e = l.getFullState();
            Se.updateMenuStates(e), a.emit(r.STATE_CHANGED, {
                state: e
            });
        }
        toggleUI() {
            const e = !l.uiVisible;
            l.setUIVisible(e);
        }
        setUIVisible(e) {
            l.setUIVisible(e);
        }
        toggleLeftPanel() {
            const e = !l.leftPanelOpen;
            l.setLeftPanelOpen(e), a.emit(e ? r.UI_PANEL_OPENED : r.UI_PANEL_CLOSED, {
                panelName: "left"
            });
        }
        toggleRightInspector() {
            const e = !l.rightInspectorOpen;
            l.setRightInspectorOpen(e), a.emit(e ? r.UI_PANEL_OPENED : r.UI_PANEL_CLOSED, {
                panelName: "right"
            });
        }
        toggleBottomDock() {
            const e = !l.bottomDockOpen;
            l.setBottomDockOpen(e), a.emit(e ? r.UI_PANEL_OPENED : r.UI_PANEL_CLOSED, {
                panelName: "bottom"
            });
        }
        updateFPS(e) {
            l.setFps(e);
        }
        getFPS() {
            return l.fps;
        }
        getAverageFPS() {
            return l.averageFps;
        }
        setupEventListeners() {
            a.on(r.MODEL_LOADED, ({ object: e, fileName: t })=>{
                console.log(`✅ Model loaded: ${t}`, e);
            }), a.on(r.SELECTION_CHANGED, ({ selected: e })=>{
                e ? console.log("Object selected:", e) : console.log("Selection cleared");
            }), a.on(r.TOOL_CHANGED, ({ oldTool: e, newTool: t })=>{
                console.log(`Tool changed: ${e} → ${t}`);
            }), a.on(r.NAVIGATION_MODE_CHANGED, ({ mode: e })=>{
                console.log(`Navigation mode: ${e}`);
            });
        }
        async executeCommand(e, t) {
            try {
                console.log(`🎯 AppController: Delegating command to registry: ${e}`), a.emit(r.COMMAND_EXECUTE_BEFORE, {
                    id: e,
                    payload: t
                });
                const { commandRegistry: o } = await A(async ()=>{
                    const { commandRegistry: i } = await Promise.resolve().then(()=>Te);
                    return {
                        commandRegistry: i
                    };
                }, void 0);
                return await o.execute(e, t), a.emit(r.COMMAND_EXECUTE_SUCCESS, {
                    id: e,
                    payload: t,
                    duration: 0
                }), {
                    success: !0,
                    message: "Command executed successfully"
                };
            } catch (o) {
                return console.error(`❌ Command execution failed: ${e}`, o), a.emit(r.COMMAND_EXECUTE_FAIL, {
                    id: e,
                    payload: t,
                    error: o
                }), {
                    success: !1,
                    error: o.message || "Unknown error"
                };
            }
        }
        async routeCommand(e, t) {
            const [o] = e.split(".");
            switch(o){
                case "file":
                    return this.executeFileCommand(e, t);
                case "edit":
                    return this.executeEditCommand(e, t);
                case "view":
                    return this.executeViewCommand(e, t);
                case "model":
                    return this.executeModelCommand(e, t);
                case "tool":
                    return this.executeToolCommand(e, t);
                case "xr":
                    return this.executeXRCommand(e, t);
                case "network":
                    return this.executeNetworkCommand(e, t);
                case "theme":
                    return this.executeThemeCommand(e, t);
                case "ai":
                    return this.executeAICommand(e, t);
                case "script":
                    return this.executeScriptCommand(e, t);
                case "help":
                    return this.executeHelpCommand(e, t);
                default:
                    return {
                        success: !1,
                        error: `Unknown command category: ${o}`
                    };
            }
        }
        async executeFileCommand(e, t) {
            switch(console.log(`📁 File command: ${e}`, t), e){
                case "file.new":
                    {
                        const o = t?.template || "empty";
                        return a.emit(r.PROJECT_NEW, {
                            template: o
                        }), this.projectManager.reset(), this.selectionManager.deselectObject(), this.layerManager.clear(), l.setActiveTool(m.NONE), l.setNavigationMode(f.FLY), a.emit(r.PROJECT_RESET, {}), console.log(`📄 New project created with template: ${o}`), {
                            success: !0,
                            message: `New project created (${o})`
                        };
                    }
                case "file.open.ifc":
                case "file.open.gltf":
                case "file.open.obj":
                    {
                        const o = e.split(".")[2];
                        return a.emit(r.FILE_OPEN_DIALOG, {
                            fileTypes: [
                                o.toUpperCase()
                            ]
                        }), {
                            success: !0,
                            message: `Opening ${o.toUpperCase()} file picker...`
                        };
                    }
                case "file.save":
                    try {
                        const o = this.createProjectSnapshot();
                        a.emit(r.PROJECT_SAVE, {});
                        const i = new Blob([
                            JSON.stringify(o, null, 2)
                        ], {
                            type: "application/json"
                        }), u = URL.createObjectURL(i), c = document.createElement("a");
                        return c.href = u, c.download = `project_${Date.now()}.arxis.json`, c.click(), URL.revokeObjectURL(u), a.emit(r.PROJECT_SAVED, {
                            filePath: c.download,
                            snapshot: o
                        }), {
                            success: !0,
                            message: "Project saved successfully"
                        };
                    } catch (o) {
                        return a.emit(r.PROJECT_SAVE_FAILED, {
                            error: o.message
                        }), {
                            success: !1,
                            error: `Failed to save project: ${o.message}`
                        };
                    }
                case "file.saveAs":
                    return this.executeFileCommand("file.save", t);
                case "file.export.glb":
                    {
                        const o = t?.selection || !1;
                        return a.emit(r.EXPORT_GLB, {
                            selection: o
                        }), {
                            success: !0,
                            message: `Exporting ${o ? "selection" : "scene"} as GLB...`
                        };
                    }
                case "file.export.screenshot":
                    {
                        const o = t?.quality || "high";
                        try {
                            const i = document.querySelector("canvas");
                            return i ? (i.toBlob((u)=>{
                                if (!u) {
                                    a.emit(r.EXPORT_FAILED, {
                                        type: "screenshot",
                                        error: "Failed to create blob"
                                    });
                                    return;
                                }
                                const c = URL.createObjectURL(u), g = document.createElement("a");
                                g.href = c, g.download = `screenshot_${Date.now()}.png`, g.click(), URL.revokeObjectURL(c), a.emit(r.EXPORT_COMPLETE, {
                                    type: "screenshot",
                                    filePath: g.download
                                });
                            }, "image/png", o === "high" ? 1 : .8), {
                                success: !0,
                                message: "Screenshot captured"
                            }) : {
                                success: !1,
                                error: "Canvas not found"
                            };
                        } catch (i) {
                            return a.emit(r.EXPORT_FAILED, {
                                type: "screenshot",
                                error: i.message
                            }), {
                                success: !1,
                                error: `Failed to capture screenshot: ${i.message}`
                            };
                        }
                    }
                case "file.close":
                    return confirm("Close project? Unsaved changes will be lost.") ? this.executeFileCommand("file.new", {
                        template: "empty"
                    }) : {
                        success: !1,
                        message: "Close cancelled"
                    };
                default:
                    return {
                        success: !1,
                        error: `Unknown file command: ${e}`
                    };
            }
        }
        createProjectSnapshot() {
            return {
                version: "1.0",
                timestamp: Date.now(),
                name: this.projectManager.getProjectName() || "Untitled",
                description: "",
                assets: this.projectManager.getLoadedAssets().map((e)=>({
                        id: e.id,
                        type: e.type,
                        name: e.name,
                        url: e.url || null,
                        fileName: e.fileName || null
                    })),
                camera: {
                    position: [
                        0,
                        0,
                        0
                    ],
                    target: [
                        0,
                        0,
                        0
                    ],
                    fov: 75,
                    mode: "perspective"
                },
                layers: this.layerManager.getLayers().map((e)=>({
                        id: e.id,
                        name: e.name,
                        visible: e.visible,
                        locked: e.locked,
                        color: e.color
                    })),
                activeTool: l.activeTool,
                settings: {
                    renderQuality: "high",
                    theme: "default"
                },
                annotations: []
            };
        }
        async executeEditCommand(e, t) {
            return console.log(`✏️  Edit command: ${e}`), {
                success: !0,
                message: `Edit command executed: ${e}`
            };
        }
        async executeViewCommand(e, t) {
            switch(console.log(`👁️  View command: ${e}`), e){
                case "view.camera.top":
                case "view.camera.front":
                case "view.camera.side":
                case "view.camera.isometric":
                    return {
                        success: !0,
                        message: `Camera view changed to ${e.split(".")[2]}`
                    };
                case "view.focus.selection":
                    return {
                        success: !0,
                        message: "Focused on selection"
                    };
                case "view.frame.all":
                    return {
                        success: !0,
                        message: "Framed all objects"
                    };
                case "view.fullscreen":
                    return document.fullscreenElement ? await document.exitFullscreen() : await document.documentElement.requestFullscreen(), {
                        success: !0,
                        message: "Toggled fullscreen"
                    };
                default:
                    return {
                        success: !1,
                        error: `Unknown view command: ${e}`
                    };
            }
        }
        async executeModelCommand(e, t) {
            switch(console.log(`🏗️  Model command: ${e}`), e){
                case "model.show.all":
                    return {
                        success: !0,
                        message: "Showed all objects"
                    };
                case "model.hide.selected":
                    return {
                        success: !0,
                        message: "Hidden selected objects"
                    };
                case "model.isolate.selected":
                    return {
                        success: !0,
                        message: "Isolated selected objects"
                    };
                case "model.hide.byClass":
                    const o = t?.ifcClass;
                    return o ? {
                        success: !0,
                        message: `Hidden objects of class: ${o}`
                    } : {
                        success: !1,
                        error: "IFC class not specified"
                    };
                default:
                    return {
                        success: !1,
                        error: `Unknown model command: ${e}`
                    };
            }
        }
        async executeToolCommand(e, t) {
            switch(console.log(`🔧 Tool command: ${e}`), e){
                case "tool.select":
                    return this.activateTool(m.SELECTION), {
                        success: !0,
                        message: "Selection tool activated"
                    };
                case "tool.measure":
                    return this.activateTool(m.MEASUREMENT), {
                        success: !0,
                        message: "Measurement tool activated"
                    };
                case "tool.navigate":
                    return this.activateTool(m.NAVIGATION), {
                        success: !0,
                        message: "Navigation tool activated"
                    };
                case "tool.layer":
                    return this.activateTool(m.LAYER), {
                        success: !0,
                        message: "Layer tool activated"
                    };
                default:
                    return {
                        success: !1,
                        error: `Unknown tool command: ${e}`
                    };
            }
        }
        async executeXRCommand(e, t) {
            return console.log(`🥽 XR command: ${e}`), {
                success: !0,
                message: `XR command executed: ${e}`
            };
        }
        async executeNetworkCommand(e, t) {
            return console.log(`🌐 Network command: ${e}`), {
                success: !0,
                message: `Network command executed: ${e}`
            };
        }
        async executeThemeCommand(e, t) {
            return console.log(`🎨 Theme command: ${e}`), {
                success: !0,
                message: `Theme command executed: ${e}`
            };
        }
        async executeAICommand(e, t) {
            return console.log(`🤖 AI command: ${e}`), {
                success: !0,
                message: `AI command executed: ${e}`
            };
        }
        async executeScriptCommand(e, t) {
            return console.log(`📜 Script command: ${e}`), {
                success: !0,
                message: `Script command executed: ${e}`
            };
        }
        async executeHelpCommand(e, t) {
            switch(console.log(`❓ Help command: ${e}`), e){
                case "help.docs":
                    return window.open("https://github.com/avilaops/ArxisVR/blob/main/README.md", "_blank"), {
                        success: !0,
                        message: "Opened documentation"
                    };
                case "help.shortcuts":
                    return {
                        success: !0,
                        message: "Opened shortcuts"
                    };
                case "help.about":
                    return alert(`ArxisVR v4.0

High-performance IFC viewer with VR, AI, and Multiplayer.

© 2024 ArxisVR Team`), {
                        success: !0,
                        message: "Showed about dialog"
                    };
                default:
                    return {
                        success: !1,
                        error: `Unknown help command: ${e}`
                    };
            }
        }
        async getIFCProperties(e, t) {
            if (!this.ifcLoader) return console.warn("IFCLoader not available"), null;
            try {
                return await this.ifcLoader.getAllProperties(e, t);
            } catch (o) {
                return console.error("Error getting IFC properties:", o), null;
            }
        }
        dispose() {
            this.toolManager.dispose(), this.projectManager.dispose(), this.selectionManager.dispose(), this.navigationManager.dispose(), this.layerManager.dispose(), this._renderer = null, console.log("AppController disposed");
        }
    };
    E = _.getInstance();
});
export { _ as AppController, E as appController, __tla };
