import { AIAssistant } from './AIAssistant';
import { ViewerSnapshot } from './ViewerStateSnapshot';

/**
 * ChatUI - Interface de chat com AI Assistant
 * 
 * Componente de UI para interagir com o assistente AI.
 * Estilo moderno, responsivo, com histórico de mensagens.
 */
export class ChatUI {
  private container: HTMLDivElement;
  private messagesContainer: HTMLDivElement;
  private inputContainer: HTMLDivElement;
  private input: HTMLInputElement;
  private sendButton: HTMLButtonElement;
  private toggleButton: HTMLButtonElement;
  private assistant: AIAssistant;
  private getStateSnapshot: () => ViewerSnapshot;
  private isOpen: boolean = false;
  
  constructor(
    assistant: AIAssistant,
    getStateSnapshot: () => ViewerSnapshot,
    containerId: string = 'ai-chat-container'
  ) {
    this.assistant = assistant;
    this.getStateSnapshot = getStateSnapshot;
    
    // Usa container existente ou cria novo
    const existingContainer = document.getElementById(containerId) as HTMLDivElement;
    if (existingContainer) {
      this.container = existingContainer;
      this.applyContainerStyles(this.container);
    } else {
      this.container = this.createContainer();
      document.body.appendChild(this.container);
    }
    
    // Cria componentes
    this.messagesContainer = this.createMessagesContainer();
    this.inputContainer = this.createInputContainer();
    this.input = this.createInput();
    this.sendButton = this.createSendButton();
    this.toggleButton = this.createToggleButton();
    
    // Monta UI
    this.inputContainer.appendChild(this.input);
    this.inputContainer.appendChild(this.sendButton);
    this.container.appendChild(this.messagesContainer);
    this.container.appendChild(this.inputContainer);
    document.body.appendChild(this.toggleButton);
    
    // Events
    this.setupEvents();
    
    console.log('💬 Chat UI initialized');
  }
  
  /**
   * Cria container principal
   */
  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = 'ai-chat-container';
    this.applyContainerStyles(container);
    return container;
  }
  
  /**
   * Aplica estilos ao container
   */
  private applyContainerStyles(container: HTMLDivElement): void {
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      height: 600px;
      background: rgba(30, 30, 40, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      display: none;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      z-index: 10000;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
  }
  
  /**
   * Cria container de mensagens
   */
  private createMessagesContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;
    
    // Mensagem de boas-vindas
    this.addMessage(
      'assistant',
      'Hello! I\'m your AI assistant for ArxisVR. Ask me anything about the model or tell me what you\'d like to do!'
    );
    
    return container;
  }
  
  /**
   * Cria container de input
   */
  private createInputContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    `;
    return container;
  }
  
  /**
   * Cria input de texto
   */
  private createInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.cssText = `
      flex: 1;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
    `;
    
    input.addEventListener('focus', () => {
      input.style.background = 'rgba(255, 255, 255, 0.08)';
      input.style.borderColor = 'rgba(100, 149, 237, 0.5)';
    });
    
    input.addEventListener('blur', () => {
      input.style.background = 'rgba(255, 255, 255, 0.05)';
      input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
    
    return input;
  }
  
  /**
   * Cria botão de envio
   */
  private createSendButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = '➤';
    button.style.cssText = `
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
    
    return button;
  }
  
  /**
   * Cria botão de toggle
   */
  private createToggleButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = '🤖';
    button.title = 'AI Assistant';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      color: #fff;
      font-size: 28px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
      transition: all 0.2s;
      z-index: 9999;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 24px rgba(102, 126, 234, 0.6)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
    });
    
    return button;
  }
  
  /**
   * Setup events
   */
  private setupEvents(): void {
    // Toggle chat
    this.toggleButton.addEventListener('click', () => {
      this.toggle();
    });
    
    // Send message
    this.sendButton.addEventListener('click', () => {
      this.sendMessage();
    });
    
    // Enter to send
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }
  
  /**
   * Toggle chat visibility
   */
  public toggle(): void {
    this.isOpen = !this.isOpen;
    this.container.style.display = this.isOpen ? 'flex' : 'none';
    this.toggleButton.style.display = this.isOpen ? 'none' : 'block';
    
    if (this.isOpen) {
      this.input.focus();
    }
  }
  
  /**
   * Envia mensagem
   */
  private async sendMessage(): Promise<void> {
    const message = this.input.value.trim();
    if (!message) return;
    
    // Adiciona mensagem do usuário
    this.addMessage('user', message);
    this.input.value = '';
    
    // Mostra indicador de "typing"
    const typingId = this.addTypingIndicator();
    
    try {
      // Processa comando
      const stateSnapshot = this.getStateSnapshot();
      const result = await this.assistant.processCommand(message, stateSnapshot);
      
      // Remove typing indicator
      this.removeTypingIndicator(typingId);
      
      // Adiciona resposta
      this.addMessage('assistant', result.response);
      
      if (!result.success && result.error) {
        this.addMessage('error', `Error: ${result.error}`);
      }
      
    } catch (error) {
      this.removeTypingIndicator(typingId);
      this.addMessage('error', 'Sorry, something went wrong.');
      console.error('Chat error:', error);
    }
  }
  
  /**
   * Adiciona mensagem ao chat
   */
  private addMessage(role: 'user' | 'assistant' | 'error', content: string): void {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      padding: 12px 16px;
      border-radius: 12px;
      max-width: 80%;
      word-wrap: break-word;
      ${role === 'user' 
        ? 'align-self: flex-end; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff;'
        : role === 'assistant'
        ? 'align-self: flex-start; background: rgba(255, 255, 255, 0.08); color: #fff;'
        : 'align-self: flex-start; background: rgba(255, 87, 87, 0.2); color: #ff5757; border: 1px solid rgba(255, 87, 87, 0.4);'
      }
    `;
    messageDiv.textContent = content;
    this.messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  /**
   * Adiciona indicador de "typing"
   */
  private addTypingIndicator(): string {
    const id = `typing-${Date.now()}`;
    const indicator = document.createElement('div');
    indicator.id = id;
    indicator.style.cssText = `
      align-self: flex-start;
      padding: 12px 16px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.08);
      color: #888;
      font-style: italic;
    `;
    indicator.textContent = 'AI is thinking...';
    this.messagesContainer.appendChild(indicator);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return id;
  }
  
  /**
   * Remove indicador de "typing"
   */
  private removeTypingIndicator(id: string): void {
    const indicator = document.getElementById(id);
    if (indicator) {
      indicator.remove();
    }
  }
  
  /**
   * Limpa chat
   */
  public clear(): void {
    this.messagesContainer.innerHTML = '';
    this.addMessage(
      'assistant',
      'Chat cleared! How can I help you?'
    );
  }
}
