/**
 * Test Script - Executar no Console do Navegador
 * 
 * Copia e cola este código no console para executar todos os testes
 */

console.log('🧪 Starting Automated Tests...\n');

// ==================== Test Suite ====================

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// ==================== Test 1: Verificar Objetos Globais ====================

test('Global objects exist', () => {
  assert(typeof window.appController !== 'undefined', 'appController should be defined');
  assert(typeof window.commandRegistry !== 'undefined', 'commandRegistry should be defined');
  assert(typeof window.menuManager !== 'undefined', 'menuManager should be defined');
  assert(typeof window.eventBus !== 'undefined', 'eventBus should be defined');
  assert(typeof window.EventType !== 'undefined', 'EventType should be defined');
  assert(typeof window.themeManager !== 'undefined', 'themeManager should be defined');
});

// ==================== Test 2: Comandos Registrados ====================

test('Commands are registered', () => {
  const commands = commandRegistry.getAll();
  assert(commands.length > 50, `Should have 50+ commands, got ${commands.length}`);
  
  // Verificar comandos específicos
  const viewTop = commandRegistry.get('view.top');
  assert(viewTop !== undefined, 'view.top should be registered');
  assert(viewTop.label === 'Top View', 'view.top should have correct label');
});

test('Command categories exist', () => {
  const fileCommands = commandRegistry.getByCategory('file');
  const editCommands = commandRegistry.getByCategory('edit');
  const viewCommands = commandRegistry.getByCategory('view');
  
  assert(fileCommands.length > 0, 'Should have file commands');
  assert(editCommands.length > 0, 'Should have edit commands');
  assert(viewCommands.length > 0, 'Should have view commands');
});

// ==================== Test 3: Menus Registrados ====================

test('Menus are registered', () => {
  const menus = menuManager.getTopLevelMenus();
  assert(menus.length === 6, `Should have 6 menus, got ${menus.length}`);
  
  const menuIds = menus.map(m => m.id);
  assert(menuIds.includes('file'), 'Should have file menu');
  assert(menuIds.includes('edit'), 'Should have edit menu');
  assert(menuIds.includes('view'), 'Should have view menu');
  assert(menuIds.includes('model'), 'Should have model menu');
  assert(menuIds.includes('tools'), 'Should have tools menu');
  assert(menuIds.includes('help'), 'Should have help menu');
});

test('Menu items exist', () => {
  const fileMenu = menuManager.getMenu('file');
  assert(fileMenu !== undefined, 'file menu should exist');
  assert(fileMenu.items.length > 0, 'file menu should have items');
});

// ==================== Test 4: Shortcuts Registrados ====================

test('Shortcuts are registered', () => {
  const shortcuts = menuManager.getShortcuts();
  const shortcutKeys = Object.keys(shortcuts);
  
  assert(shortcutKeys.length > 10, `Should have 10+ shortcuts, got ${shortcutKeys.length}`);
  assert(shortcuts['Ctrl+O'] !== undefined, 'Should have Ctrl+O shortcut');
  assert(shortcuts['G'] !== undefined, 'Should have G shortcut');
  assert(shortcuts['F'] !== undefined, 'Should have F shortcut');
});

// ==================== Test 5: AppController ====================

test('AppController is initialized', () => {
  const state = appController.getState();
  assert(state !== undefined, 'AppState should be defined');
  assert(typeof appController.toolManager !== 'undefined', 'toolManager should exist');
  assert(typeof appController.layerManager !== 'undefined', 'layerManager should exist');
});

test('Tools are registered', () => {
  const tools = appController.toolManager.getRegisteredTools();
  assert(tools.length > 0, 'Should have registered tools');
});

// ==================== Test 6: UI Components ====================

test('UI containers exist in DOM', () => {
  assert(document.getElementById('top-bar') !== null, 'top-bar should exist');
  assert(document.getElementById('left-panel') !== null, 'left-panel should exist');
  assert(document.getElementById('right-inspector') !== null, 'right-inspector should exist');
  assert(document.getElementById('bottom-dock') !== null, 'bottom-dock should exist');
});

// ==================== Test 7: Theme System ====================

test('Theme system is working', () => {
  const themes = themeManager.getAvailableThemes();
  assert(themes.length > 0, `Should have themes, got ${themes.length}`);
  
  const currentTheme = themeManager.getCurrentTheme();
  assert(currentTheme !== null, 'Should have a current theme');
});

// ==================== Test 8: Command Execution ====================

test('Commands can be executed', async () => {
  // Executar comando sem side-effects perigosos
  const result = await commandRegistry.execute('view.top');
  assert(result.success === true, 'view.top should execute successfully');
});

// ==================== Test 9: Event System ====================

test('Event system works', () => {
  let eventReceived = false;
  
  const handler = () => {
    eventReceived = true;
  };
  
  eventBus.on(EventType.CAMERA_VIEW_CHANGE, handler);
  eventBus.emit(EventType.CAMERA_VIEW_CHANGE, { view: 'test' });
  eventBus.off(EventType.CAMERA_VIEW_CHANGE, handler);
  
  assert(eventReceived === true, 'Event should be received');
});

// ==================== Run Tests ====================

async function runTests() {
  console.log(`Running ${tests.length} tests...\n`);
  
  for (const { name, fn } of tests) {
    try {
      await fn();
      passed++;
      console.log(`✅ ${name}`);
    } catch (error) {
      failed++;
      console.error(`❌ ${name}`);
      console.error(`   ${error.message}`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}/${tests.length}`);
  console.log(`   ❌ Failed: ${failed}/${tests.length}`);
  console.log(`   Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  console.log('='.repeat(50));
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Ready for production!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Execute
runTests();
