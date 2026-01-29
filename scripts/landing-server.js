import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Email configuration (configure with your SMTP settings)
const createTransporter = () => {
  // For production, use environment variables
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password'
    }
  });
};

// Email templates
const createCustomerEmailTemplate = (data) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏗️ ArxisVR</h1>
      <h2>Solicitação Recebida com Sucesso!</h2>
    </div>
    <div class="content">
      <p>Olá <strong>${data.name}</strong>,</p>
      
      <p>Recebemos sua solicitação de contato e agradecemos pelo interesse no ArxisVR! 🎉</p>
      
      <div class="info-box">
        <h3>📋 Resumo da sua solicitação:</h3>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Empresa:</strong> ${data.company}</p>
        ${data.role ? `<p><strong>Cargo:</strong> ${data.role}</p>` : ''}
        ${data.teamSize ? `<p><strong>Tamanho da Equipe:</strong> ${data.teamSize}</p>` : ''}
        ${data.interest ? `<p><strong>Interesse:</strong> ${data.interest}</p>` : ''}
      </div>
      
      <h3>📞 Próximos Passos:</h3>
      <ul>
        <li>Nossa equipe comercial entrará em contato em até <strong>2 horas úteis</strong></li>
        <li>Vamos agendar uma demonstração personalizada do ArxisVR</li>
        <li>Você receberá acesso ao período de teste gratuito de 14 dias</li>
      </ul>
      
      <p>Enquanto isso, que tal conhecer mais sobre nossa plataforma?</p>
      
      <center>
        <a href="https://arxisvr.com" class="button">Explorar Recursos</a>
      </center>
      
      <p>Se tiver alguma dúvida urgente, responda este email ou entre em contato através do telefone: <strong>+55 (11) 3000-0000</strong></p>
      
      <p>Atenciosamente,<br>
      <strong>Equipe ArxisVR</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 ArxisVR - Plataforma Imersiva BIM em Nuvem</p>
      <p>Este é um email automático. Por favor, não responda.</p>
    </div>
  </div>
</body>
</html>
  `;
};

const createInternalNotificationTemplate = (data) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0f172a; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
    .data-field { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #10b981; }
    .urgent { background: #fef3c7; border-left-color: #f59e0b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🔔 Novo Lead - ArxisVR</h2>
      <p>Recebido em: ${new Date().toLocaleString('pt-BR')}</p>
    </div>
    <div class="content">
      <div class="data-field urgent">
        <strong>PRIORIDADE:</strong> ${data.interest === 'enterprise' ? 'ALTA - Enterprise' : 'Normal'}
      </div>
      
      <h3>📊 Informações do Lead:</h3>
      
      <div class="data-field">
        <strong>Nome:</strong> ${data.name}
      </div>
      
      <div class="data-field">
        <strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a>
      </div>
      
      <div class="data-field">
        <strong>Telefone:</strong> <a href="tel:${data.phone}">${data.phone}</a>
      </div>
      
      <div class="data-field">
        <strong>Empresa:</strong> ${data.company}
      </div>
      
      ${data.role ? `<div class="data-field"><strong>Cargo:</strong> ${data.role}</div>` : ''}
      
      ${data.teamSize ? `<div class="data-field"><strong>Tamanho da Equipe:</strong> ${data.teamSize}</div>` : ''}
      
      ${data.interest ? `<div class="data-field"><strong>Interesse:</strong> ${data.interest}</div>` : ''}
      
      ${data.message ? `
        <div class="data-field">
          <strong>Mensagem:</strong><br>
          ${data.message}
        </div>
      ` : ''}
      
      <h3>⚡ Ações Recomendadas:</h3>
      <ul>
        <li>Responder em até 2 horas úteis</li>
        <li>Agendar demonstração personalizada</li>
        <li>Configurar acesso de teste (14 dias)</li>
        ${data.interest === 'enterprise' ? '<li><strong>URGENTE:</strong> Encaminhar para gerente de contas Enterprise</li>' : ''}
      </ul>
    </div>
  </div>
</body>
</html>
  `;
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      role,
      teamSize,
      interest,
      message
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !company) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios não preenchidos' 
      });
    }

    const transporter = createTransporter();

    // Send confirmation email to customer
    await transporter.sendMail({
      from: `"ArxisVR" <${process.env.SMTP_USER || 'noreply@arxisvr.com'}>`,
      to: email,
      subject: '✅ Solicitação Recebida - ArxisVR',
      html: createCustomerEmailTemplate(req.body)
    });

    // Send notification to sales team
    await transporter.sendMail({
      from: `"ArxisVR Sistema" <${process.env.SMTP_USER || 'noreply@arxisvr.com'}>`,
      to: process.env.SALES_EMAIL || 'vendas@arxisvr.com',
      subject: `🔔 Novo Lead: ${company} - ${name}`,
      html: createInternalNotificationTemplate(req.body)
    });

    // Log lead to console (in production, save to database)
    console.log('New Lead:', {
      timestamp: new Date().toISOString(),
      name,
      email,
      company,
      interest
    });

    res.status(200).json({ 
      success: true,
      message: 'Solicitação enviada com sucesso!' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      error: 'Erro ao processar solicitação. Tente novamente.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/landing.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Landing page server running on http://localhost:${PORT}`);
  console.log(`📧 Email notifications: ${process.env.SMTP_USER ? 'CONFIGURED' : 'USING DEFAULT (UPDATE .env)'}`);
});

export default app;
