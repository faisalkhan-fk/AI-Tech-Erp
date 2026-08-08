package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Task;
import java.util.List;
public interface TaskRepository extends JpaRepository<Task, Long> {
  List<Task> findByAssignedToId(Long employeeId);
  List<Task> findByProjectId(Long projectId);
}