package com.restarant.backend.service.utils;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;


import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

/**
 * Description:
 *
 * @author: POLY_DuyDVPH12712
 * @version: 1.0
 * @since: 5/7/2022
 * Project_name: Tech-cam
 */
@Component
public class MailUtils {
    @Autowired
    private JavaMailSender sender;
    @Async
    public void send(MailDto mail) throws MessagingException {
        try {
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true,"UTF-8");
            message.addHeader("Content-type","text/HTML; charset=UTF-8");
            message.addHeader("format","flowed");
            message.addHeader("Content-transfer-Encoding","8bit");
            message.setContent(mail.getBody(),"text/HTML; charset=UTF-8");
            helper.setFrom(mail.getFrom());
            helper.setTo(mail.getTo());
            helper.setSubject(mail.getSubject());
//  helper.setText(mail.getBody(), true);
            helper.setReplyTo(mail.getFrom());
            sender.send(message);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
