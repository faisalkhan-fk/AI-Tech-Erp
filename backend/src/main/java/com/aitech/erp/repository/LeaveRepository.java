package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.LeaveRequest;
import java.util.List;
public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
  List<LeaveRequest> findByEmployeeId(Long employeeId);
}