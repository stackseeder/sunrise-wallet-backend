const path = require('path')
const Email = require('email-templates')
const i18n = require('i18n')
const emailHistoryHelper = require('../helpers/emailHistory.helper')

const {
  mailFromAddress,
  mailFromName,
  mailSMTPHost,
  mailSMTPPort,
  mailSMTPUser,
  mailSMTPPassword,
  frontendUrl,
  env
} = require('../../config/vars')

const sendEmail = async data => {
  if (env === 'development') {
    console.log(data)
  }
  if (env === 'test') {
    return
  }

  i18n.setLocale(data.locale)
  const email = new Email({
    message: {
      from: `${mailFromName} <${mailFromAddress}>`
    },
    transport: {
      host: mailSMTPHost,
      port: mailSMTPPort,
      secure: false, // upgrade later with TTLS
      auth: {
        user: mailSMTPUser,
        pass: mailSMTPPassword
      }
    },
    send: true,
    preview: false,
    views: {
      options: {
        extension: 'ejs'
      },
      root: path.join(__dirname, '../templates')
    }
  })
  const message = {
    to: data.to,
    subject: data.subject
  }

  if (data.attachment) {
    message.attachments = [
      {
        filename: data.attachment.name,
        content: data.attachment.content
      }
    ]
  }

  email
    .send({
      template: data.template,
      message,
      locals: {
        ...data.locals,
        footerText1: i18n.__('templateFooter.TEXT1'),
        footerText2: i18n.__('templateFooter.TEXT2'),
        footerText3: i18n.__('templateFooter.TEXT3')
      }
    })
    .then(async () => {
      console.log(`[${data.template}] Email has been sent!`)
      await emailHistoryHelper.saveEmailHistory(
        mailFromAddress,
        data.to,
        data.subject,
        'sent'
      )
    })
    .catch(async error => {
      console.log(`[Email Failed]`)
      await emailHistoryHelper.saveEmailHistory(
        mailFromAddress,
        data.to,
        data.subject,
        'failed'
      )
    })
}

module.exports = {
  /**
   * @param user
   * @param locale
   * @returns {Promise<void>}
   */
  async sendResetPassword(user, locale = 'en') {
    i18n.setLocale(locale)
    const template = 'resetPassword'
    const to = user.email
    const subject = i18n.__('templateResetPassword.SUBJECT')
    const locals = {
      title: i18n.__('templateResetPassword.TITLE'),
      hello: i18n.__('templateResetPassword.HELLO'),
      fullName: `${user.firstName} ${user.lastName}`,
      message: i18n.__('templateResetPassword.MESSAGE'),
      resetLink: `${frontendUrl}/reset/${user.verification}`,
      resetText: i18n.__('templateResetPassword.RESET_TEXT')
    }
    await sendEmail({
      locale,
      template,
      to,
      subject,
      locals
    })
  }
}
