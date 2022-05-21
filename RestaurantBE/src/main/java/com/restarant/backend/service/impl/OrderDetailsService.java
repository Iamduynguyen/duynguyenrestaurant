package com.restarant.backend.service.impl;

import com.restarant.backend.dto.OrderDetailsDto;
import com.restarant.backend.entity.OrderDetails;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.repository.FoodDetallsRepository;
import com.restarant.backend.repository.OrderDetailsRepository;
import com.restarant.backend.repository.TableOrderRepository;
import com.restarant.backend.repository.TablesRepository;
import com.restarant.backend.service.IOrderDetailsService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.utils.JwtServiceUtils;
import com.restarant.backend.service.validate.OrderDetailsValidator;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Slf4j
@Service
public class OrderDetailsService implements IOrderDetailsService {

    private final OrderDetailsRepository orderDetailsRepository;
    private final IConverterDto<OrderDetails, OrderDetailsDto> mapper;
    private final TablesRepository tablesRepository;
    private final TableOrderRepository tableOrderRepository;
    private final FoodDetallsRepository foodDetallsRepository;
    private final JwtServiceUtils jwtServiceUtils;
    private final OrderDetailsValidator orderDetailsValidator = new OrderDetailsValidator();


    public OrderDetailsService(OrderDetailsRepository orderDetailsRepository,
                               TablesRepository tablesRepository,
                               FoodDetallsRepository foodDetallsRepository,
                               TableOrderRepository tableOrderRepository,
                               @Qualifier("orderDetailsMapper") IConverterDto<OrderDetails, OrderDetailsDto> mapper, JwtServiceUtils jwtServiceUtils) {
        this.orderDetailsRepository = orderDetailsRepository;
        this.mapper = mapper;
        this.tablesRepository = tablesRepository;
        this.foodDetallsRepository = foodDetallsRepository;
        this.tableOrderRepository = tableOrderRepository;
        this.jwtServiceUtils = jwtServiceUtils;
    }

    @Override
    public OrderDetailsDto create(OrderDetailsDto dto) throws InvalidDataExeception {
        orderDetailsValidator.validate(dto);
        if (!foodDetallsRepository.existsById(dto.getFoodDetalls().getId())) {
            throw new InvalidDataExeception("The FoodDetailsId not found");
        }
        if(!tableOrderRepository.existsById(dto.getTableOrderId())){
            throw new InvalidDataExeception("The TableOrderId not found");
        }
        OrderDetails entity = new OrderDetails();
        entity.setQuantity(dto.getQuantity());
        entity.setAmount(dto.getFoodDetalls().getAmount());
        entity.setTableOrder(tableOrderRepository.findById(dto.getTableOrderId()).get());
        entity.setFoodDetalls(foodDetallsRepository.findById(dto.getFoodDetalls().getId()).get());
        entity.setStatus(0);
        OrderDetails result = orderDetailsRepository.save(entity);
        System.out.println(entity.toString()+"alo");
        return mapper.convertToDto(result);
    }

    @Override
    public OrderDetailsDto update(Long id, OrderDetailsDto dto) throws InvalidDataExeception {
        orderDetailsValidator.validate(dto);
        if (!orderDetailsRepository.existsById(id)) {
            throw new InvalidDataExeception("The orderDetail[id] not found");
        }
        if (!foodDetallsRepository.existsById(dto.getFoodDetalls().getId())) {
            throw new InvalidDataExeception("The FoodDetallId not found");
        }

        log.info("Someone edit category id-" + id);
        OrderDetails entity = mapper.convertToEntity(dto);
        entity.setId(id);
        return mapper.convertToDto(
                orderDetailsRepository.save(entity));
    }

    public OrderDetailsDto confirm(Long id, Integer status, HttpServletRequest req) throws InvalidDataExeception {
        OrderDetails entity = orderDetailsRepository.findById(id).get();
        String staffUsername = jwtServiceUtils.getAccountByToken(req).getLogin();
        entity.setStatus(status);
        OrderTotal orderTotal = entity.getTableOrder().getOrderTotal();
        if (status==3){
            String text = staffUsername+"\t đã xác nhận cho bàn "+ entity.getTableOrder().getTables();
            if (!orderTotal.getNote().contains(text)){
                orderTotal.setNote(text+" lúc "+ LocalDate.now());
            }
        }
        return mapper.convertToDto(
                orderDetailsRepository.save(entity));
    }

    @Override
    public OrderDetailsDto getById(Long id) {
        return mapper.convertToDto(
                orderDetailsRepository.findById(id).orElse(null));
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        OrderDetails orderDetails = orderDetailsRepository.findById(id).orElse(null);
        if (orderDetails == null) {
            throw new InvalidDataExeception("The orderDetail[id] not found");
        }
        if(orderDetails.getStatus() == 1){
            return false;
        }

        log.info("Someone delete category id-" + id);
        orderDetailsRepository.deleteById(id);
        return true;
    }

    @Override
    public List<OrderDetailsDto> getAll() {
        return null;
    }

    @Override
    public List<OrderDetailsDto> getAll(Pageable pageable) {
        return mapper.convertToListDto(
                orderDetailsRepository.findAll(pageable).getContent()
        );
    }
}
