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
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirmação de Agendamento</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet">
      </head>
      <body
        style="
          margin: 0;
          padding: 0;
          font-family: 'Manrope', sans-serif;
          background-color: #f5f5f5;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="background-color: #f5f5f5; padding: 40px 20px"
        >
          <tr>
            <td align="center">
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    style="
                      background: linear-gradient(135deg, #002E77 0%, #002E77 100%);
                      padding: 40px 30px;
                      text-align: center;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    "
                  >
                  
                <svg width="45" height="45" viewBox="0 0 82 89" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.3053 80.4631C24.1089 81.9917 26.9867 83.1478 29.9292 83.961L29.9566 83.9684C44.6562 77.8068 55.7178 65.2716 59.9592 49.9182C57.034 60.5088 46.0913 66.7142 35.5018 63.789C24.9103 60.8628 18.7048 49.9209 21.631 39.3304C25.7672 23.9185 36.882 11.3073 51.6627 5.28757C33.7939 0.321601 14.2108 8.11952 4.95669 25.1341C-5.79026 44.933 1.51372 69.6887 21.3053 80.4631Z" fill="url(#paint0_linear_16089_928)"/>
                <path d="M56.1714 58.1684C56.7208 57.0529 57.0374 56.3495 57.1699 56.217L56.2171 58.1227L56.1714 58.1684C52.7687 65.0768 40.4373 87.7929 7.62265 88.6133C12.7044 86.7076 22.4868 81.3718 20.9623 75.2737L31.4434 72.4152L47.6416 65.7453L54.3114 60.0283L56.1714 58.1684Z" fill="url(#paint1_linear_16089_928)"/>
                <path d="M60.275 8.24176C57.4236 6.69605 54.4968 5.52689 51.5041 4.70461L51.4762 4.69709C36.5261 10.9279 24.7736 24.7737 20.9623 40.9718C23.9373 30.2623 35.0665 22.1452 45.8366 25.1033C56.6086 28.0623 62.9198 39.1272 59.9438 49.8367C55.737 65.4217 44.4328 78.1746 29.4002 84.262C47.5736 89.2838 67.4904 81.3982 76.9023 64.1925C87.8324 44.1711 80.404 19.1372 60.275 8.24176Z" fill="url(#paint2_linear_16089_928)"/>
                <path d="M24.8147 30.787C24.2559 31.9151 23.9338 32.6264 23.7991 32.7603L24.7682 30.8332L24.8147 30.787C28.2753 23.801 40.817 0.829614 74.1909 3.11136e-05C69.0225 1.92711 59.0734 7.32292 60.6239 13.4896L49.9641 16.3802L33.4898 23.1249L26.7063 28.9062L24.8147 30.787Z" fill="url(#paint3_linear_16089_928)"/>
                <defs>
                <linearGradient id="paint0_linear_16089_928" x1="29.9796" y1="3.81128" x2="29.9796" y2="88.6133" gradientUnits="userSpaceOnUse">
                <stop stop-color="white"/>
                <stop offset="1" stop-color="#002E77"/>
                </linearGradient>
                <linearGradient id="paint1_linear_16089_928" x1="29.9796" y1="3.81128" x2="29.9796" y2="88.6133" gradientUnits="userSpaceOnUse">
                <stop stop-color="white"/>
                <stop offset="1" stop-color="#002E77"/>
                </linearGradient>
                <linearGradient id="paint2_linear_16089_928" x1="51.4529" y1="85.7549" x2="51.4529" y2="3.05176e-05" gradientUnits="userSpaceOnUse">
                <stop stop-color="white"/>
                <stop offset="1" stop-color="#002E77"/>
                </linearGradient>
                <linearGradient id="paint3_linear_16089_928" x1="51.4529" y1="85.7549" x2="51.4529" y2="3.05176e-05" gradientUnits="userSpaceOnUse">
                <stop stop-color="white"/>
                <stop offset="1" stop-color="#002E77"/>
                </linearGradient>
                </defs>
                </svg>

                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                        font-weight: 600;
                      "
                    >
                      Agendamento Pendente
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px">
                    <p
                      style="
                        margin: 0 0 20px;
                        color: #333333;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      Olá <strong>${data.patientName}</strong>,
                    </p>

                    <p
                      style="
                        margin: 0 0 30px;
                        color: #666666;
                        font-size: 15px;
                        line-height: 1.6;
                      "
                    >
                      Seu agendamento foi realizado com sucesso! Confira os detalhes
                      abaixo:
                    </p>

                    <!-- Appointment Details Card -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #f8f9fa;
                        border-left: 4px solid #002E77;
                        margin-bottom: 30px;
                      "
                    >
                      <tr>
                        <td style="padding: 25px">
                          <!-- Doctor -->
                          <div style="margin-bottom: 20px">
                            <p
                              style="
                                margin: 0 0 5px;
                                color: #999999;
                                font-size: 12px;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                              "
                            >
                              Médico(a)
                            </p>
                            <p
                              style="
                                margin: 0;
                                color: #333333;
                                font-size: 16px;
                                font-weight: 600;
                              "
                            >
                              Dr(a). ${data.doctorName}
                            </p>
                            <p
                              style="
                                margin: 5px 0 0;
                                color: #666666;
                                font-size: 14px;
                              "
                            >
                              ${data.doctorSpecialty}
                            </p>
                          </div>

                          <!-- Clinic -->
                          <div style="margin-bottom: 20px">
                            <p
                              style="
                                margin: 0 0 5px;
                                color: #999999;
                                font-size: 12px;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                              "
                            >
                              Clínica
                            </p>
                            <p
                              style="
                                margin: 0;
                                color: #333333;
                                font-size: 16px;
                                font-weight: 600;
                              "
                            >
                              ${data.clinicName}
                            </p>
                          </div>

                          <!-- Date & Time -->
                          <div style="margin-bottom: 20px">
                            <p
                              style="
                                margin: 0 0 5px;
                                color: #999999;
                                font-size: 12px;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                              "
                            >
                              Data e Horário
                            </p>
                            <p
                              style="
                                margin: 0;
                                color: #333333;
                                font-size: 16px;
                                font-weight: 600;
                              "
                            >
                              ${formattedDate} às ${formattedTime}
                            </p>
                          </div>

                          <!-- Price -->
                          <div style="margin-bottom: 20px">
                            <p
                              style="
                                margin: 0 0 5px;
                                color: #999999;
                                font-size: 12px;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                              "
                            >
                              Valor da Consulta
                            </p>
                            <p
                              style="
                                margin: 0;
                                color: #002E77;
                                font-size: 18px;
                                font-weight: 700;
                              "
                            >
                              ${formattedPrice}
                            </p>
                          </div>

                          <!-- Status -->
                          <div>
                            <p
                              style="
                                margin: 0 0 5px;
                                color: #999999;
                                font-size: 12px;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                              "
                            >
                              Status
                            </p>
                            <span
                              style="
                                display: inline-block;
                                background-color: #fff3cd;
                                color: #856404;
                                padding: 6px 12px;
                                border-radius: 4px;
                                font-size: 13px;
                                font-weight: 600;
                              "
                            >
                              ⏳ Pendente de Confirmação
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Confirmation Button -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="margin-bottom: 30px"
                    >
                      <tr>
                        <td align="center" style="padding: 20px 0">
                          <a
                            href="${confirmationUrl}"
                            style="
                              display: inline-block;
                              background: linear-gradient(
                                135deg,
                                #002E77 0%,
                                #002E77 100%
                              );
                              color: #ffffff;
                              padding: 16px 40px;
                              border-radius: 12px;
                              text-decoration: none;
                              font-weight: 600;
                              font-size: 16px;
                              box-shadow: 0 4px 6px #002E774d;
                            "
                          >
                            Confirmar Agendamento
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Important Note -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #e7f3ff;
                        border-radius: 8px;
                        margin-bottom: 20px;
                      "
                    >
                      <tr>
                        <td style="padding: 20px">
                          <p
                            style="
                              margin: 0;
                              color: #004085;
                              font-size: 14px;
                              line-height: 1.6;
                            "
                          >
                            <strong>ℹ️ Importante:</strong> Clique no botão acima
                            para confirmar sua presença. Após a confirmação, você
                            receberá um email de confirmação.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin: 0;
                        color: #666666;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      Em caso de dúvidas ou necessidade de reagendamento, entre em
                      contato com a clínica.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      background-color: #f8f9fa;
                      padding: 30px;
                      text-align: center;
                      border-top: 1px solid #e9ecef;
                    "
                  >
                    <p style="margin: 0 0 10px; color: #999999; font-size: 13px">
                      Este é um email automático, por favor não responda.
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 13px">
                      © ${new Date().getFullYear()} ${data.clinicName}. Todos os
                      direitos reservados.
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
