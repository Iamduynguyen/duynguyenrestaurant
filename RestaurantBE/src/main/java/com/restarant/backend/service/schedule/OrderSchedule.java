package com.restarant.backend.service.schedule;

import com.restarant.backend.dto.OrderTotalDto;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.repository.OrderTotalRepository;
import com.restarant.backend.service.IOrderTotalService;
import com.restarant.backend.service.utils.MailDto;
import com.restarant.backend.service.utils.MailUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Description:
 *
 * @author: POLY_DuyDVPH12712
 * @version: 1.0
 * @since: 5/7/2022
 * Project_name: Tech-cam
 */
@Component
public class OrderSchedule {
    @Autowired
    private OrderTotalRepository orderTotalRepository;
    @Autowired
    private MailUtils mailUtils;
    @Scheduled(cron = "0 30 17-22 * * *")
    public void sendMail()  {
        System.out.println("chạy thành công");
        Date now = new Date();
        List<OrderTotal> list = orderTotalRepository.findAll();
        for (OrderTotal orderTotalDto : list){
            if(Objects.nonNull(orderTotalDto.getOrderTime()) && now.getTime()- orderTotalDto.getOrderTime() == 30*60*60){
                MailDto mailDto = new MailDto();
                mailDto.setBody("Sắp đến giờ khách hàng gọi bàn mời khách hàng đến với cửa hàng");
                mailDto.setSubject("nhắc nhở đặt bàn");
                mailDto.setTo(orderTotalDto.getCustomer().getEmail());
                mailDto.setFrom("duy@gmail.com");
                System.out.println("sendmail");
                try {
                    mailUtils.send(mailDto);
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
