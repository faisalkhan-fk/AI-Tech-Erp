package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Comment;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  List<Comment> findByTaskId(Long taskId);
}
