"use server"

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import nodemailer from 'nodemailer'

dayjs.extend(utc)
dayjs.extend(timezone)

interface AppointmentEmailData {
  patientName: string
  patientEmail: string
  doctorName: string
  doctorSpecialty: string
  clinicName: string
  appointmentDate: Date
  appointmentPrice: number
  confirmationToken: string
}

const createEmailTemplate = (data: AppointmentEmailData): string => {
  const formattedDate = dayjs.utc(data.appointmentDate).local().format('DD/MM/YYYY')
  const formattedTime = dayjs.utc(data.appointmentDate).local().format('HH:mm')
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(data.appointmentPrice / 100)

  const confirmationUrl = `${process.env.BETTER_AUTH_URL}/api/confirm-appointment/${data.confirmationToken}`

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Agendamento</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                    ✅ Agendamento Confirmado
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                    Olá <strong>${data.patientName}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">
                    Seu agendamento foi realizado com sucesso! Confira os detalhes abaixo:
                  </p>
                  
                  <!-- Appointment Details Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 25px;">
                        <!-- Doctor -->
                        <div style="margin-bottom: 20px;">
                          <p style="margin: 0 0 5px; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Médico(a)
                          </p>
                          <p style="margin: 0; color: #333333; font-size: 16px; font-weight: 600;">
                            Dr(a). ${data.doctorName}
                          </p>
                          <p style="margin: 5px 0 0; color: #666666; font-size: 14px;">
                            ${data.doctorSpecialty}
                          </p>
                        </div>
                        
                        <!-- Clinic -->
                        <div style="margin-bottom: 20px;">
                          <p style="margin: 0 0 5px; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Clínica
                          </p>
                          <p style="margin: 0; color: #333333; font-size: 16px; font-weight: 600;">
                            ${data.clinicName}
                          </p>
                        </div>
                        
                        <!-- Date & Time -->
                        <div style="margin-bottom: 20px;">
                          <p style="margin: 0 0 5px; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Data e Horário
                          </p>
                          <p style="margin: 0; color: #333333; font-size: 16px; font-weight: 600;">
                            📅 ${formattedDate} às ${formattedTime}
                          </p>
                        </div>
                        
                        <!-- Price -->
                        <div style="margin-bottom: 20px;">
                          <p style="margin: 0 0 5px; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Valor da Consulta
                          </p>
                          <p style="margin: 0; color: #667eea; font-size: 18px; font-weight: 700;">
                            ${formattedPrice}
                          </p>
                        </div>
                        
                        <!-- Status -->
                        <div>
                          <p style="margin: 0 0 5px; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                            Status
                          </p>
                          <span style="display: inline-block; background-color: #fff3cd; color: #856404; padding: 6px 12px; border-radius: 4px; font-size: 13px; font-weight: 600;">
                            ⏳ Pendente de Confirmação
                          </span>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Confirmation Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${confirmationUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                          ✅ Confirmar Agendamento
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Important Note -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e7f3ff; border-radius: 8px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0; color: #004085; font-size: 14px; line-height: 1.6;">
                          <strong>ℹ️ Importante:</strong> Clique no botão acima para confirmar sua presença. Após a confirmação, você receberá um email de confirmação.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    Em caso de dúvidas ou necessidade de reagendamento, entre em contato com a clínica.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px; color: #999999; font-size: 13px;">
                    Este é um email automático, por favor não responda.
                  </p>
                  <p style="margin: 0; color: #999999; font-size: 13px;">
                    © ${new Date().getFullYear()} ${data.clinicName}. Todos os direitos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export const sendAppointmentConfirmationEmail = async (data: AppointmentEmailData) => {
  try {
    // Validate environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials not configured in environment variables')
      return { success: false, error: 'Email credentials not configured' }
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // Format date for subject
    const formattedDate = dayjs.utc(data.appointmentDate).local().format('DD/MM/YYYY')

    // Email options
    const mailOptions = {
      from: {
        name: data.clinicName,
        address: process.env.GMAIL_USER,
      },
      to: data.patientEmail,
      subject: `Agendamento com Dr(a). ${data.doctorName} na ${data.clinicName} | ${formattedDate}`,
      html: createEmailTemplate(data),
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
