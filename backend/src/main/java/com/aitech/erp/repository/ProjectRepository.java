package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Project;
public interface ProjectRepository extends JpaRepository<Project, Long> {}