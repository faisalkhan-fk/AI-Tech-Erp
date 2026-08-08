package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Attendance;
import java.util.List;
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
  List<Attendance> findByEmployeeId(Long employeeId);
  Attendance findByEmployeeIdAndDate(Long employeeId, java.time.LocalDate date);
}