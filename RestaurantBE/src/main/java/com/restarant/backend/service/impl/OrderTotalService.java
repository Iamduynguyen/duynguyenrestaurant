package com.restarant.backend.service.impl;

import com.restarant.backend.config.Config;
import com.restarant.backend.dto.*;
import com.restarant.backend.entity.*;
import com.restarant.backend.model.OrderTotalStatus;
import com.restarant.backend.repository.*;
import com.restarant.backend.service.IOrderTotalService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.utils.ConvertTime;
import com.restarant.backend.service.utils.JwtServiceUtils;
import com.restarant.backend.service.utils.MailDto;
import com.restarant.backend.service.utils.MailUtils;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.NotImplementedException;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

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
    IConverterDto<Customer, CustomerDto> mapperCus;
    @Autowired
    private MailUtils mailUtils;

    @Autowired
    private ConvertTime convertTime;
    @Autowired
    private JwtServiceUtils jwtServiceUtils;
    @Autowired
    TableService tableService;
    private final OrderTotalRepository orderTotalRepository;
    private final IConverterDto<OrderTotal, OrderTotalDto> mapper;
    private final IConverterDto<TableOrder, TableOrderDto> tableOrderMapper;
    private final CustomerRepository customerRepository;
    private final TableOrderRepository tableOrderRepository;
    @Autowired
    TablesRepository tablesRepository;
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
    public String confirmCustomerGoRestaurant(Long id) throws InvalidDataExeception {
        OrderTotal orderTotal = orderTotalRepository.getById(id);
        if (Objects.isNull(orderTotal)) {
            throw new InvalidDataExeception("Vui lòng thử lại.");
        }
        orderTotal.setStatus(5);
        try {
            orderTotalRepository.save(orderTotal);
        } catch (Exception e) {
            return "FAIL";
        }
        return "SUCCESS";
    }

    @Override
    public List<GetAllToTalOrder> getAllOrderTotal() {
        Type type = new TypeToken<List<GetAllToTalOrder>>() {
        }.getType();
        List<OrderTotal> orderTotalList = orderTotalRepository.getAllBysort();
        List<GetAllToTalOrder> getAllToTalOrders = MODEL_MAPPER.map(orderTotalList, type);
        for (GetAllToTalOrder x : getAllToTalOrders) {
            if (Objects.nonNull(x.getVoucher())) {
                Voucher voucher = voucherRepository.getById(x.getVoucher());
                double voucherDiscount = voucher.getPercent() / 100.0;
                BigDecimal sumMoney = x.getAmountTotal().multiply(BigDecimal.valueOf(voucherDiscount));
//                BigDecimal check = sumMoney.subtract(voucher.getMaxMoney());
                if (sumMoney.compareTo(voucher.getMaxMoney()) > 0) {
                    x.setDiscount(voucher.getMaxMoney());
                } else {
                    x.setDiscount(sumMoney);
                }
            }
            List<TableOrder> tableOrder = tableOrderRepository.getAllByTotalId(x.getId());
            List<GetTableOrder> getTableOrders = new ArrayList<>();
            for (TableOrder tableOrder1 : tableOrder) {
                GetTableOrder getTableOrder = new GetTableOrder();
                getTableOrder.setOrderTableId(tableOrder1.getId());
                getTableOrder.setOrderId(tableOrder1.getOrderTotal().getId());
                getTableOrder.setTablesId(tableOrder1.getTables().getId());
                List<OrderDetails> orderDetails = orderDetailsRepository.getByOrderTableId(tableOrder1.getId());
                List<GetAllFoodOrder> foodOrders = new ArrayList<>();
                for (OrderDetails y : orderDetails) {
                    GetAllFoodOrder getAllFoodOrder = new GetAllFoodOrder();
                    getAllFoodOrder.setFoodDetailsId(y.getFoodDetalls().getId());
                    getAllFoodOrder.setFoodName(y.getFoodDetalls().getFood().getName());
                    getAllFoodOrder.setSize(y.getFoodDetalls().getFoodsize());
                    getAllFoodOrder.setOrderTableId(y.getTableOrder().getId());
                    getAllFoodOrder.setDiscount(y.getFoodDetalls().getDiscount());
                    getAllFoodOrder.setAmount(y.getAmount());
                    getAllFoodOrder.setQuantity(y.getQuantity());
                    getAllFoodOrder.setId(y.getId());
                    foodOrders.add(getAllFoodOrder);
                }
                getTableOrder.setFoodOrders(foodOrders);
                getTableOrders.add(getTableOrder);
            }
            x.setOrders(getTableOrders);
        }
        return getAllToTalOrders;
    }

    @Override
    public String paymentVnpay(HttpServletRequest request, Long toTalOrderid) throws IOException {
        OrderTotal orderTotal = orderTotalRepository.getById(toTalOrderid);
        if (Objects.isNull(orderTotal.getId())) {
            return "FAIL";
        }
        String vnpay_id = Config.getRandomNumber(8);
        orderTotal.setVnpay_id(vnpay_id);
        try {
            orderTotalRepository.save(orderTotal);
        } catch (Exception e) {
            return "FAIL";
        }
        return VNPAYService.payments(orderTotal.getDeposit().intValue(), vnpay_id, request);
    }

    @Override
    public String checkOutVnpay(String bankStatus, String bankTransactionId) {
        OrderTotal orderTotal = orderTotalRepository.findByVnpay_id(bankTransactionId);
        if (Objects.isNull(orderTotal)) {
            return "FAIL";
        }
        if (StringUtils.equalsIgnoreCase(bankStatus, "00")) {
            orderTotal.setStatus(4);
            orderTotal.setAmountTotal(tinhtongtien(orderTotal));
            orderTotalRepository.save(orderTotal);
            return "SUCCESS";
        } else {
            return "FAIL";
        }

    }

    public BigDecimal tinhtongtien(OrderTotal x) {
        List<OrderDetails> lst = orderTotalRepository.getTinhtong(x.getId());
        BigDecimal tong = new BigDecimal("0");
        for (OrderDetails j : lst) {
            tong = tong.add(j.getAmount());
        }
        return tong;
    }


    public Boolean changeTable(OrderTotal orderTotal) {
        System.out.println(orderTotal.toString1());
        List<Tables> tables = new ArrayList<>();
        List<TableOrder> tableOrders = new ArrayList<>();
        for (TableOrder x : orderTotal.getTableOrders()) {
            tableOrders.add(x);
            tables.add(x.getTables());
        }

        List<TableDto> tableDtos = tableService.getbytime(orderTotal.getOrderTime(), orderTotal.getEndTime());
        System.out.println("solouongban" + tableDtos.size());
        List<Long> tbIdActive = new ArrayList<>();
        for (TableDto x : tableDtos) {
            if (x.getStatus() == 0) {
                tbIdActive.add(x.getId());
                System.out.println("ban trong " + x.getId());
            }
        }
        int i = 0;
        int j = 0;
        for (TableDto t : tableDtos) {
            for (Tables q : tables) {
                if (t.getStatus() == 1) {
                    System.out.println("ban k trong " + t.getId());
                    if (q.getId() == t.getId()) {
                        System.out.println("loi ban " + t.getId());
                        if (j > tbIdActive.size()) {
                            System.out.println("fail");
                            return false;
                        }
                        Tables newTb = tablesRepository.findById(tbIdActive.get(j)).get();
                        TableOrder k = tableOrders.get(i);
                        k.setTables(newTb);
                        tableOrderRepository.save(k);
                        orderTotal.setNote("Tự động thay đổi số bàn " + t.getId() + " thành số bàn " + newTb.getId());
                        System.out.println("Tự động thay đổi số bàn " + t.getId() + " thành số bàn " + newTb.getId());
                        orderTotalRepository.save(orderTotal);
                        j++;
                    }
                }
            }
        }
        return true;
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
                orderDetails1 = orderDetailsRepository.findByTableOrderIdAndFoodDetallsId(counterDto.getTableId(), foodCouter.getFoodId());
                FoodDetails foodDetails = foodDetallsRepository.findById(foodCouter.getFoodId()).get();
                if (Objects.isNull(orderDetails1)) {
                    orderDetails1 = new OrderDetails();
                    orderDetails1.setQuantity((long) foodCouter.getQuantity());
                    orderDetails1.setAmount(foodDetails.getAmount().subtract(foodDetails.getDiscount()));
                    orderDetails1.setFoodDetalls(foodDetails);
                } else {
                    orderDetails1.setQuantity((long) foodCouter.getQuantity() + orderDetails1.getQuantity());
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
    public String confirmCustomerOrderOnline(Long id) {
        try {
            OrderTotal orderTotal = orderTotalRepository.getById(id);
            orderTotal.setStatus(1);
            orderTotalRepository.save(orderTotal);
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";
    }

    @Override
    public String deleteOrderDetails(List<Long> ids) {
        for (Long id : ids) {
            try {
                orderDetailsRepository.deleteOrderDetailsByIds(id);
            } catch (Exception e) {
                e.printStackTrace();
                return "FAIL";
            }
        }
        return "SUCCESS";
    }

    @Override
    public String confirmOrderOnline(Long id, HttpServletRequest request) {
        try {
            OrderTotal orderTotal = orderTotalRepository.getById(id);
            if (Objects.nonNull(orderTotal)) {
                orderTotal.setStatus(2);
                List<OrderDetails> lst = orderDetailsRepository.getByOrdertotalId(orderTotal.getId());
                for (OrderDetails x : lst) {
                    if (x.getStatus() == 1) {
                        x.setStatus(2);
                    }
                }
                orderDetailsRepository.saveAll(lst);
                orderTotal.setNote("Người xác nhận đơn hàng :" + jwtServiceUtils.getUserName(request));
                orderTotalRepository.save(orderTotal);
                MailDto mailDto = new MailDto();
                mailDto.setTo(orderTotal.getCustomer().getEmail());
                mailDto.setBody("Chúng tôi đã xác nhận đặt bàn của quý khách. Mong quý khách để ý để đặt cọc bàn. <br> Mọi thắc mắc xin liên hệ  hotline : 0978825572. xin cảm ơn");
                mailDto.setSubject("Xác nhận đơn hành thành công");
                mailDto.setFrom("admin@gmail.com");
                mailUtils.send(mailDto);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";
    }

    @Override
    public String confirmDepositOnline(ConfirmDepositOnline request, HttpServletRequest req) {
        String staffID = jwtServiceUtils.getUserName(req);
        try {
            String msg = "";
            OrderTotal orderTotal = orderTotalRepository.getById(request.getId());
            orderTotal.setDeposit(request.getDeposit());
            if (request.getDeposit().intValue() == 0) {
                orderTotal.setStatus(4);
                orderTotal.setNote("nhân viên " + staffID + " đã xác nhận đơn hàng không yêu cầu đặt cọc");
                List<OrderDetails> lst1 = orderTotalRepository.getOrderdetailbyTotalAndStatus(orderTotal.getId(), 1);
                for (OrderDetails x : lst1) {
                    x.setStatus(2);
                    x.setAmount(x.getFoodDetalls().getAmount().subtract(x.getFoodDetalls().getDiscount()));
                }
                orderTotalRepository.save(orderTotal);
                changeTable(orderTotal);
                orderDetailsRepository.saveAll(lst1);
            } else {
                orderTotal.setStatus(2);
                List<OrderDetails> lst = orderTotalRepository.getOrderdetailbyTotalAndStatus(orderTotal.getId(), 1);
                lst.forEach(o -> o.setStatus(2));
                orderTotal.setNote("nhân viên " + staffID + " đã yêu cầu đặt cọc " + request.getDeposit().toString() + " vnđ");
                orderTotalRepository.save(orderTotal);
                changeTable(orderTotal);
                orderDetailsRepository.saveAll(lst);
                msg = " Mong quý khách để ý để đặt cọc bàn, số tiền  là" + request.getDeposit().toString();
            }
            MailDto mailDto = new MailDto();
            mailDto.setTo(orderTotal.getCustomer().getEmail());
            mailDto.setBody("Chúng tôi đã xác nhận đặt bàn của quý khách." + msg + ". <br> Mọi thắc mắc xin liên hệ  hotline : 0978825572. xin cảm ơn");
            mailDto.setSubject("Xác nhận đơn hành thành công");
            mailDto.setFrom("admin@gmail.com");
            mailUtils.send(mailDto);
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";
    }

    @Override
    public String cancelOrder(Long id) {
        try {
            OrderTotal orderTotal = orderTotalRepository.getById(id);
            orderTotal.setStatus(-1);
            orderTotalRepository.save(orderTotal);
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";

    }

    @Override
    public String editOrderDetails(EditOrderDetailsRequest request) {
        try {
            List<OrderDetails> orderDetailsList = new ArrayList<>();
            for (EditOrderDetails editOrderDetails : request.getOrderDetails()) {
                OrderDetails orderDetails = orderDetailsRepository.getById(editOrderDetails.getOrderDetailsId());
                if (orderDetails.getQuantity() < editOrderDetails.getQuantity()) {
                    throw new Exception("Số lượng cần trừ không thể lớn hơn  số  lượng  đã đặt");
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
                return "NO ITEM ORDERED";
            }
            BigDecimal amoutTotal = BigDecimal.ZERO;
            for (OrderDetails orderDetail : orderDetails) {
                amoutTotal = amoutTotal.add(orderDetail.getAmount().multiply(BigDecimal.valueOf(orderDetail.getQuantity())));
            }
            OrderTotal orderTotal = orderTotalRepository.getById(paymentDto.getOrderId());
            if (Objects.nonNull(paymentDto.getVoucherId()) && Objects.nonNull(orderTotal.getCustomer())) {
                Voucher voucher = voucherRepository.findByIdAndCustomerId(paymentDto.getVoucherId(), orderTotal.getCustomer().getId());
                if (Objects.isNull(voucher)) {
                    return "VOUCHER NOT";
                }
                OrderTotal checkVoucher = orderTotalRepository.findByVoucherAndCustomerIdAndStatus(paymentDto.getVoucherId(), orderTotal.getCustomer().getId(), 6);
                if (Objects.nonNull(checkVoucher)) {
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

    @Override
    public List<OrderHistoryDto> getHistoryOrder(Long customerId) {
        List<OrderHistoryDto> orderHistorys = new ArrayList<>();
        List<OrderTotal> orderTotals = orderTotalRepository.getAllOrderTotalByCustomerId(customerId);
        orderTotals.forEach(o -> {
            OrderHistoryDto orderHistoryDto = new OrderHistoryDto();
            StringBuilder orderTables = new StringBuilder();
            LocalDateTime startTime = convertTime.convertToLocalDateTime(o.getOrderTime());
            orderHistoryDto.setDate(startTime.getDayOfMonth() + "/" + startTime.getMonthValue() + "/" + startTime.getYear());
            LocalDateTime endTime = convertTime.convertToLocalDateTime(o.getEndTime());
            orderHistoryDto.setStartTime(startTime.getHour() + ":" + startTime.getMinute());
            orderHistoryDto.setEndTime(endTime.getHour() + ":" + endTime.getMinute());
            orderHistoryDto.setId(o.getId());
            o.getTableOrders().forEach(t -> {
                orderTables.append(t.getTables().getId() + ", ");
            });
            orderHistoryDto.setTables(orderTables.toString().substring(0, orderTables.length()-2));
            orderHistoryDto.setAmountTotal(o.getAmountTotal().toString());
            orderHistoryDto.setPaymentType(o.getVnpay_id() == null ? "Tiền mặt" : "Thanh toán thẻ");
            orderHistoryDto.setId(o.getId());
            orderHistorys.add(orderHistoryDto);
        });
        return orderHistorys;
    }

    @Override
    public List<OrderHistoryDetailDto> getOrderDetailsByOrderId(Long orderId) {
        List<OrderHistoryDetailDto> orderHistoryDetailDtos = new ArrayList<>();
        List<TableOrder> tableOrders = tableOrderRepository.getAllByTotalId(orderId);
        tableOrders.forEach(o -> {
            List<OrderDetails> orderDetails = orderDetailsRepository.getByOrderTableId(o.getId());
            orderDetails.forEach(a -> {
                orderHistoryDetailDtos.add(OrderHistoryDetailDto.builder()
                        .tableId(String.valueOf(o.getTables().getId()))
                        .foodName(a.getFoodDetalls().getFood().getName())
                        .foodImage(a.getFoodDetalls().getFoodMedias().get(0).getFoodurl())
                        .quantity(a.getQuantity() == null ? "0" : a.getQuantity().toString())
                        .amount(a.getAmount() == null ? "0" : a.getAmount().toString())
                        .build());
            });
        });
        return orderHistoryDetailDtos;
    }


    public Boolean customerConfirm1(Long id) {
        OrderTotal orderTotal = orderTotalRepository.findById(id).get();
        List<OrderDetails> lst2 = orderTotalRepository.getOrderdetailbyTotalAndStatus(id, 2);

        List<OrderDetails> lst = orderTotalRepository.getOrderdetailbyTotalAndStatus(id, 0);
        if (orderTotal == null) {
            return false;
        } else if (lst == null) {
            return false;
        }
        List<Long> ids = new ArrayList<>();
        if (orderTotal.getStatus() > 3) {
            for (OrderDetails y : lst2) {
                for (OrderDetails x : lst) {
                    x.setStatus(2);
                    x.setAmount(x.getFoodDetalls().getAmount().subtract(x.getFoodDetalls().getDiscount()));
                    if (y.getFoodDetalls().getId() == x.getFoodDetalls().getId()&&y.getAmount() == x.getAmount()) {
                            y.setQuantity(y.getQuantity() + x.getQuantity());
                            ids.add(x.getId());
                    }else {
                        BigDecimal dis = x.getFoodDetalls().getAmount().multiply(x.getFoodDetalls().getDiscount()).divide(new BigDecimal("100"));
                        BigDecimal giam = x.getFoodDetalls().getAmount().subtract(dis);
                        x.setAmount(giam);
                        x.setStatus(2);
                    }
                }
            }
        } else {
            for (OrderDetails x : lst) {
                BigDecimal dis = x.getFoodDetalls().getAmount().multiply(x.getFoodDetalls().getDiscount()).divide(new BigDecimal("100"));
                BigDecimal giam = x.getFoodDetalls().getAmount().subtract(dis);
                x.setAmount(giam);
                x.setStatus(1);
            }
        }
        orderDetailsRepository.saveAll(lst);
        for (Long x : ids) {
            orderTotalRepository.deleteById(x);
        }
        orderTotal.setStatus(1);
        orderTotalRepository.save(orderTotal);
        return true;
    }

    public Boolean customerConfirm3(Long id) {
        OrderTotal orderTotal = orderTotalRepository.findById(id).get();
        List<OrderDetails> lst = orderTotalRepository.getOrderdetailbyTotalAndStatus(id, 2);
        if (orderTotal == null) {
            return false;
        } else if (lst == null) {
            return false;
        }
        for (OrderDetails x : lst) {
            x.setStatus(3);
        }
        orderDetailsRepository.saveAll(lst);
        orderTotal.setStatus(3);
        orderTotalRepository.save(orderTotal);
        return true;
    }

    public Boolean customerConfirm6(Long id) {
        OrderTotal orderTotal = orderTotalRepository.findById(id).get();
        List<OrderDetails> lst = orderTotalRepository.getOrderdetailbyTotalAndStatus(id, 5);
        if (orderTotal == null) {
            return false;
        } else if (lst == null) {
            return false;
        }
        for (OrderDetails x : lst) {
            x.setStatus(6);
        }
        orderDetailsRepository.saveAll(lst);
        orderTotal.setStatus(6);
        orderTotalRepository.save(orderTotal);
        return true;
    }

    public Boolean staffConfirm2(Long id, HttpServletRequest req) {
        String username = jwtServiceUtils.getUserName(req);
        OrderTotal orderTotal = orderTotalRepository.findById(id).get();
        List<OrderDetails> lst = orderTotalRepository.getOrderdetailbyTotalAndStatus(id, 1);
        if (username == null) {
            return false;
        }

        if (!lst.isEmpty()) {
            for (OrderDetails x : lst) {
                x.setStatus(2);
            }
        }

        orderDetailsRepository.saveAll(lst);

        orderTotal.setStatus(2);
        orderTotalRepository.save(orderTotal);

        return true;
    }

    public Boolean staffConfirm4(Long id, HttpServletRequest req) {
        Account account = jwtServiceUtils.getAccountByToken(req);
        OrderTotal orderTotal = orderTotalRepository.findById(id).get();
        List<OrderDetails> lst = orderTotalRepository.getOrderdetailbyTotalAndStatus(id, 3);
        if (orderTotal == null || account == null) {
            return false;
        } else if (lst == null) {
            return false;
        }
        for (OrderDetails x : lst) {
            x.setStatus(4);
        }
        orderDetailsRepository.saveAll(lst);
        orderTotal.setStatus(4);
        orderTotalRepository.save(orderTotal);
        return true;
    }

    public Boolean staffConfirm5(Long id, HttpServletRequest req) {
        Account account = jwtServiceUtils.getAccountByToken(req);
        OrderTotal orderTotal = orderTotalRepository.findById(id).get();
        List<OrderDetails> lst = orderTotalRepository.getOrderdetailbyTotalAndStatus(id, 4);
        if (orderTotal == null || account == null) {
            return false;
        } else if (lst == null) {
            return false;
        }
        for (OrderDetails x : lst) {
            x.setStatus(5);
        }
        orderDetailsRepository.saveAll(lst);
        orderTotal.setStatus(5);
        orderTotalRepository.save(orderTotal);
        return true;
    }

    public Boolean staffConfirm7(Long id, HttpServletRequest req) {
        Account account = jwtServiceUtils.getAccountByToken(req);
        OrderTotal orderTotal = orderTotalRepository.findById(id).get();
        List<OrderDetails> lst = orderTotalRepository.getOrderdetailbyTotalAndStatus(id, 6);
        if (orderTotal == null || account == null) {
            return false;
        } else if (lst == null) {
            return false;
        }
        for (OrderDetails x : lst) {
            x.setStatus(7);
        }
        orderDetailsRepository.saveAll(lst);
        orderTotal.setStatus(7);
        orderTotalRepository.save(orderTotal);
        return true;
    }

    public List<OrderTotalDto> getbystatus(Integer status) {
        System.out.println(status);
        List<OrderTotal> orderTotalList = orderTotalRepository.getBystaus(status);
        if (orderTotalList == null) {
            return null;
        }
        List<OrderTotalDto> rs = new ArrayList<>();
        for (OrderTotal x : orderTotalList) {
            OrderTotalDto a = new OrderTotalDto();
            a.setId(x.getId());
            a.setAmountTotal(x.getAmountTotal());
            a.setOrderTime(x.getOrderTime());
            a.setCustomer(mapperCus.convertToDto(x.getCustomer()));
            a.setCreatedAt(x.getCreatedAt());
            a.setTableOrders(tableOrderMapper.convertToListDto(x.getTableOrders()));
            a.setStatus(convert(x.getStatus()));
            rs.add(a);
        }
        return rs;
    }

    private String convert(Integer x) {
        OrderDetails entity = new OrderDetails();
        entity.setStatus(x);
        OrderDetailsDto dto = new OrderDetailsDto();
        if (entity.getStatus() == 0) {
            dto.setStatus("Vừa thêm vào");
        }
        if (entity.getStatus() == 1) {
            dto.setStatus("chờ xác nhận");
        }
        if (entity.getStatus() == 2) {
            dto.setStatus("Đã xác nhận");
        }
        if (entity.getStatus() == 3) {
            dto.setStatus("chờ đặt cọc");
        }
        if (entity.getStatus() == 4) {
            dto.setStatus("chờ xác nhận cọc tiền");
        }
        if (entity.getStatus() == 5) {
            dto.setStatus("Sắp mang ra");
        }
        if (entity.getStatus() == 6) {
            dto.setStatus("Đang ăn");
        }
        if (entity.getStatus() == 5) {
            dto.setStatus("Đã thanh toán");
        }
        if (entity.getStatus() == 6) {
            dto.setStatus("Nhà hàng hủy");
        }
        return dto.getStatus();
    }

}
