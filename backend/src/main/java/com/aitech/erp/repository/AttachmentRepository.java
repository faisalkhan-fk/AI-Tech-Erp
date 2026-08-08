package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Attachment;
import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
  List<Attachment> findByTaskId(Long taskId);
}
