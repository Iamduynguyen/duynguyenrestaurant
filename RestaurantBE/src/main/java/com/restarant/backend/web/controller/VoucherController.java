package com.restarant.backend.web.controller;

import com.restarant.backend.dto.VoucherDto;
import com.restarant.backend.entity.Voucher;
import com.restarant.backend.repository.VoucherRepository;
import com.restarant.backend.service.IVoucherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class VoucherController {

    private final Logger log = LoggerFactory.getLogger(VoucherController.class);

    private static final String ENTITY_NAME = "voucher";

    private final IVoucherService voucherService;

    public VoucherController(IVoucherService voucherService) {
        this.voucherService = voucherService;
    }


    @PostMapping("/voucher/create")
    public ResponseEntity<?> createVoucher() {
        VoucherDto voucherDto = voucherService.createVoucherByCustomerId(1L);
        return ResponseEntity.ok(voucherDto);
    }
    /**
     * {@code POST  /vouchers} : Create a new voucher.
     *
     * @param voucher the voucher to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new voucher, or with status {@code 400 (Bad Request)} if the voucher has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
//    @PostMapping("/vouchers")
//    public ResponseEntity<Voucher> createVoucher(@RequestBody Voucher voucher) throws URISyntaxException {
//        log.debug("REST request to save Voucher : {}", voucher);
//        Voucher result = voucherRepository.save(voucher);
//        return ResponseEntity.ok().body(result);
//    }
//
//    /**
//     * {@code PUT  /vouchers/:id} : Updates an existing voucher.
//     *
//     * @param id the id of the voucher to save.
//     * @param voucher the voucher to update.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voucher,
//     * or with status {@code 400 (Bad Request)} if the voucher is not valid,
//     * or with status {@code 500 (Internal Server Error)} if the voucher couldn't be updated.
//     * @throws URISyntaxException if the Location URI syntax is incorrect.
//     */
//    @PutMapping("/vouchers/{id}")
//    public ResponseEntity<?> updateVoucher(@PathVariable(value = "id", required = false) final Long id, @RequestBody Voucher voucher)
//        throws URISyntaxException {
//        log.debug("REST request to update Voucher : {}, {}", id, voucher);
//
//        if (!voucherRepository.existsById(id)) {
//            return ResponseEntity.badRequest().body("entity not found");
//        }
//
//        Voucher result = voucherRepository.save(voucher);
//        return ResponseEntity.ok().body(result);
//    }
//
//    /**
//     * {@code GET  /vouchers} : get all the vouchers.
//     *
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vouchers in body.
//     */
//    @GetMapping("/vouchers")
//    public List<Voucher> getAllVouchers() {
//        log.debug("REST request to get all Vouchers");
//        return voucherRepository.findAll();
//    }
//
//    /**
//     * {@code GET  /vouchers/:id} : get the "id" voucher.
//     *
//     * @param id the id of the voucher to retrieve.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the voucher, or with status {@code 404 (Not Found)}.
//     */
//    @GetMapping("/vouchers/{id}")
//    public ResponseEntity<Voucher> getVoucher(@PathVariable Long id) {
//        log.debug("REST request to get Voucher : {}", id);
//        Optional<Voucher> voucher = voucherRepository.findById(id);
//        return ResponseEntity.ok().body(voucher.get());
//    }
//
//    /**
//     * {@code DELETE  /vouchers/:id} : delete the "id" voucher.
//     *
//     * @param id the id of the voucher to delete.
//     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
//     */
//    @DeleteMapping("/vouchers/{id}")
//    public ResponseEntity<Void> deleteVoucher(@PathVariable Long id) {
//        log.debug("REST request to delete Voucher : {}", id);
//        voucherRepository.deleteById(id);
//        return ResponseEntity.noContent().build();
//    }
}
