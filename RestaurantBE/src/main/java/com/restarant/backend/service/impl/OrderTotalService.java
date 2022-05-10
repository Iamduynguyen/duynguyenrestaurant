package com.restarant.backend.service.impl;

import com.restarant.backend.dto.*;
import com.restarant.backend.entity.*;
import com.restarant.backend.model.OrderTotalStatus;
import com.restarant.backend.repository.*;
import com.restarant.backend.service.IOrderTotalService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.utils.JwtServiceUtils;
import com.restarant.backend.service.utils.MailDto;
import com.restarant.backend.service.utils.MailUtils;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.NotImplementedException;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class OrderTotalService implements IOrderTotalService {
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;
    @Autowired
    private FoodDetallsRepository foodDetallsRepository;
    @Autowired
    private VoucherRepository voucherRepository;
    @Autowired
    private MailUtils mailUtils;
    @Autowired
    private JwtServiceUtils jwtServiceUtils;
    private final OrderTotalRepository orderTotalRepository;
    private final IConverterDto<OrderTotal, OrderTotalDto> mapper;
    private final IConverterDto<TableOrder, TableOrderDto> tableOrderMapper;
    private final CustomerRepository customerRepository;
    private final TableOrderRepository tableOrderRepository;
    private final TablesRepository tablesRepository;
    private final ModelMapper MODEL_MAPPER = new ModelMapper();

    public OrderTotalService(OrderTotalRepository orderTotalRepository,
                             IConverterDto<OrderTotal, OrderTotalDto> mapper,
                             IConverterDto<TableOrder, TableOrderDto> tableOrderMapper, CustomerRepository customerRepository,
                             TableOrderRepository tableOrderRepository,
                             TablesRepository tablesRepository) {
        this.orderTotalRepository = orderTotalRepository;
        this.mapper = mapper;
        this.tableOrderMapper = tableOrderMapper;
        this.customerRepository = customerRepository;
        this.tableOrderRepository = tableOrderRepository;
        this.tablesRepository = tablesRepository;
    }

    @Override
    public OrderTotalDto create(OrderTotalDto dto) throws InvalidDataExeception {
        throw new NotImplementedException();
    }

    @Override
    public OrderTotalDto update(Long id, OrderTotalDto dto) throws InvalidDataExeception {
        return null;
    }

    @Override
    public OrderTotalDto getById(Long id) {
        OrderTotal orderTotal = orderTotalRepository.findById(id).orElse(null);
        return mapper.convertToDto(orderTotal);
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        if (!orderTotalRepository.existsById(id)) {
            throw new InvalidDataExeception("The food[id] not found");
        }
        OrderTotal orderTotal = orderTotalRepository.findById(id).get();
        if (orderTotal.getStatus() >= OrderTotalStatus.WAIT_ACCEPT) {
            return false;
        }
        log.info(String.format("Someone detele orderTotal[id-%d]", id));
        orderTotalRepository.deleteById(id);
        return true;
    }

    @Override
    public List<GetAllToTalOrder> getAllOrderTotal(){
        Type type =  new TypeToken<List<GetAllToTalOrder>>(){}.getType();
        List<OrderTotal> orderTotalList = orderTotalRepository.findAll();
        List<GetAllToTalOrder> getAllToTalOrders =MODEL_MAPPER.map(orderTotalList,type);
        for (GetAllToTalOrder x : getAllToTalOrders){
            List<TableOrder> tableOrder =  tableOrderRepository.getAllByTotalId(x.getId());
            List<GetTableOrDer> getTableOrders = new ArrayList<>();
            for (TableOrder tableOrder1: tableOrder){
                GetTableOrDer getTableOrDer = new GetTableOrDer();
                getTableOrDer.setOrderTableId(tableOrder1.getId());
                getTableOrDer.setOrderId(tableOrder1.getOrderTotal().getId());
                getTableOrDer.setTablesId(tableOrder1.getTables().getId());
                List<OrderDetails>  orderDetails =  orderDetailsRepository.getByOrderTableId(tableOrder1.getId());
                for (OrderDetails y : orderDetails){
                    List<GetAllFoodOrder> foodOrders = new ArrayList<>();
                    GetAllFoodOrder getAllFoodOrder = new GetAllFoodOrder();
                    getAllFoodOrder.setFoodDetailsId(y.getFoodDetalls().getId());
                    getAllFoodOrder.setFoodName(y.getFoodDetalls().getFood().getName());
                    getAllFoodOrder.setOrderTableId(y.getTableOrder().getId());
                    getAllFoodOrder.setAmount(y.getAmount());
                    getAllFoodOrder.setQuantity(y.getQuantity());
//                    getAllFoodOrder.setNote(y.get);

                    getAllFoodOrder.setId(y.getId());
                    foodOrders.add(getAllFoodOrder);
                    getTableOrDer.setFoodOrders(foodOrders);
                }
                getTableOrders.add(getTableOrDer);
            }
            x.setOrders(getTableOrders);
        }
        return getAllToTalOrders;
    }

    @Override
    public String registrationOrderCounter(OrderCouterDto orderCouterDto, HttpServletRequest request) {
        try {
            Date now = new Date();
            OrderTotal orderTotal = new OrderTotal();
            orderTotal.setCreatedAt(now.getTime());
            orderTotal.setOrderTime(now.getTime());
            orderTotal.setStatus(5);
            // todo tạm bỏ
            orderTotal.setNote("Người tạo hóa đơn là : " + jwtServiceUtils.getUserName(request));
//            Staff staff = new Staff();
//            staff.setId(1L);
//            orderTotal.setStaff(staff);
//        orderTotal.setDeleteflag();
            if (orderCouterDto.getTableCounterDtos().isEmpty()) {
                return "FAIL";
            }
            OrderTotal orderTotalSave = orderTotalRepository.save(orderTotal);
            List<OrderDetails> orderDetailsList = new ArrayList<>();
            Tables tables = new Tables();
            FoodDetails foodDetails = new FoodDetails();
            for (TableCounterDto tableCounterDto : orderCouterDto.getTableCounterDtos()) {
                TableOrder tableOrder = new TableOrder();
                tables.setId(tableCounterDto.getTableId());
                tableOrder.setTables(tables);
                tableOrder.setOrderTotal(orderTotalSave);
                tableOrder = tableOrderRepository.save(tableOrder);
                saveOrderDetails(orderDetailsList, tableCounterDto, tableOrder);
            }
            orderDetailsRepository.saveAll(orderDetailsList);
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";

    }

    private void saveOrderDetails(List<OrderDetails> orderDetailsList, TableCounterDto tableCounterDto, TableOrder tableOrder) {
        FoodDetails foodDetails;
        for (FoodCouter foodCouter : tableCounterDto.getIdFoodCounters()) {
            OrderDetails orderDetails = new OrderDetails();
            orderDetails.setTableOrder(tableOrder);
            orderDetails.setQuantity((long) foodCouter.getQuantity());
            foodDetails = foodDetallsRepository.findById(foodCouter.getFoodId()).get();
            orderDetails.setFoodDetalls(foodDetails);
            orderDetails.setAmount(foodDetails.getAmount().subtract(foodDetails.getDiscount()));
//                    orderDetails.setStatus(5);
            orderDetailsList.add(orderDetails);
//                    orderDetailsRepository.save(orderDetails);
        }
    }

    @Override
    public String addFoodTable(TableCounterDto counterDto) {
        try {
            TableOrder orderDetails = tableOrderRepository.getById(counterDto.getTableId());
            if (Objects.isNull(orderDetails)) {
                return "FAIL";
            }
            List<OrderDetails> orderDetailsList = new ArrayList<>();
            for (FoodCouter foodCouter : counterDto.getIdFoodCounters()) {
                OrderDetails orderDetails1 = new OrderDetails();
                orderDetails1 = orderDetailsRepository.findByTableOrderIdAndFoodDetallsId(counterDto.getTableId(),foodCouter.getFoodId());
                FoodDetails foodDetails = foodDetallsRepository.findById(foodCouter.getFoodId()).get();
                if(Objects.isNull(orderDetails1)){
                    orderDetails1.setQuantity((long) foodCouter.getQuantity());
                    orderDetails1.setAmount(foodDetails.getAmount().subtract(foodDetails.getDiscount()));
                    orderDetails1.setFoodDetalls(foodDetails);
                }else {
                    orderDetails1.setQuantity((long) foodCouter.getQuantity()+orderDetails1.getQuantity());
                }
                orderDetails1.setTableOrder(orderDetails);
                orderDetailsList.add(orderDetails1);
            }
            orderDetailsRepository.saveAll(orderDetailsList);
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";
    }

    @Override
    public String confirmCustomerOrderOnline(Long id){
        try{
            OrderTotal orderTotal = orderTotalRepository.getById(id);
            orderTotal.setStatus(1);
            orderTotalRepository.save(orderTotal);
        }catch (Exception e){
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";
    }
    @Override
    public String deleteOrderDetails(List<Long> ids){
        try {
            orderDetailsRepository.deleteAllById(ids);
        }catch (Exception e){
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";
    }

    @Override
    public String confirmOrderOnline(Long id,HttpServletRequest request){
        try {
            OrderTotal orderTotal = orderTotalRepository.getById(id);
            if (Objects.nonNull(orderTotal)){
                orderTotal.setStatus(2);
                orderTotal.setNote("Người xác nhận đơn hàng :"+ jwtServiceUtils.getUserName(request));
                orderTotalRepository.save(orderTotal);
                MailDto mailDto  = new MailDto();
                mailDto.setTo(orderTotal.getCustomer().getEmail());
                mailDto.setBody("Chúng tôi đã xác nhận đặt bàn của quý khách. Mong quý khách để ý để đặt cọc bàn. <br> Mọi thắc mắc xin liên hệ  hotline : 0978825572. xin cảm ơn");
                mailDto.setSubject("Xác nhận đơn hành thành công");
                mailDto.setFrom("admin@gmail.com");
                mailUtils.send(mailDto);
            }
        }catch (Exception e){
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCCESS";
    }

    @Override
    public String confirmDepositOnline(ConfirmDepositOnline request){
        try{
            OrderTotal orderTotal = orderTotalRepository.getById(request.getId());
            orderTotal.setDeposit(request.getDeposit());
            orderTotal.setStatus(4);
            orderTotalRepository.save(orderTotal);
        }catch (Exception e){
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";
    }

    @Override
    public String cancelOrder(Long id){
        try{
            OrderTotal orderTotal = orderTotalRepository.getById(id);
            orderTotal.setStatus(-1);
            orderTotalRepository.save(orderTotal);
        }catch (Exception e){
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";

    }
    @Override
    public String editOrderDetails(EditOrderDetailsRequest request){
        try {
            List<OrderDetails> orderDetailsList = new ArrayList<>();
            for (EditOrderDetails editOrderDetails : request.getOrderDetails()){
                OrderDetails orderDetails  =  orderDetailsRepository.getById(editOrderDetails.getOrderDetailsId());
                if(orderDetails.getQuantity() < editOrderDetails.getQuantity()){
                    throw  new Exception("Số lượng cần trừ không thể lớn hơn  số  lượng  đã đặt");
                }
                orderDetails.setQuantity(orderDetails.getQuantity() - editOrderDetails.getQuantity());
                orderDetailsList.add(orderDetails);
            }
            orderDetailsRepository.saveAll(orderDetailsList);
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";
    }
    @Override
    public String payment(OrderPaymentDto paymentDto, HttpServletRequest request) {
        try {
            List<OrderDetails> orderDetails = orderDetailsRepository.getByOrdertotalId(paymentDto.getOrderId());
            if (CollectionUtils.isEmpty(orderDetails)) {
                return "FAIL";
            }
            BigDecimal amoutTotal = BigDecimal.ZERO;
            for (OrderDetails orderDetail : orderDetails) {
                amoutTotal = amoutTotal.add(orderDetail.getAmount().multiply(BigDecimal.valueOf(orderDetail.getQuantity())));
            }
            OrderTotal orderTotal = orderTotalRepository.getById(paymentDto.getOrderId());
            if(Objects.nonNull(paymentDto.getVoucherId()) && Objects.nonNull(orderTotal.getCustomer())){
                Voucher voucher  = voucherRepository.findByIdAndCustomerId(paymentDto.getVoucherId(),orderTotal.getCustomer().getId());
                if(Objects.isNull(voucher)){
                   return "VOUCHER NOT";
                }
                OrderTotal checkVoucher =  orderTotalRepository.findByVoucherAndCustomerIdAndStatus(paymentDto.getVoucherId(),orderTotal.getCustomer().getId(),6);
                if(Objects.nonNull(checkVoucher)){
                   return "VOUCHER EXITS";
                }
                orderTotal.setVoucher(paymentDto.getVoucherId());
            }
            orderTotal.setAmountTotal(amoutTotal);
            orderTotal.setStatus(6);
            if (Objects.nonNull(paymentDto.getVoucherId())) {
                orderTotal.setVoucher(paymentDto.getVoucherId());
            }
            orderTotal.setEndTime(new Date().getTime());
            orderTotal.setNote(orderTotal.getNote() + " ; " + "Người thu tiền " + jwtServiceUtils.getUserName(request));
            orderTotalRepository.save(orderTotal);
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";
    }

    @Override
    public List<OrderTotalDto> getAll() {
        List<OrderTotal> lst = orderTotalRepository.findAll();
        return mapper.convertToListDto(lst);
    }

    @Override
    public List<OrderTotalDto> getAll(Pageable pageable) {
        List<OrderTotal> lst = orderTotalRepository.findAll();
        return mapper.convertToListDto(lst);
    }

    @Override
    public OrderTotal createToCustomer(Customer customer) {
        return null;
    }

    @Override
    public BigDecimal getRevenueBetweenTime(long fromTime, long toTime) {
        List<OrderTotal> orderTotalList = orderTotalRepository.getListOrderTotalBetweenTime(fromTime, toTime, OrderTotalStatus.PAID);
        System.out.println(orderTotalList.size());
        BigDecimal total = new BigDecimal(0);
        for (OrderTotal orderTotal : orderTotalList) {
            total = total.add(orderTotal.getAmountTotal());
        }
        return total;
    }

}
