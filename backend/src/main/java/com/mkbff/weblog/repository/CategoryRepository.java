package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mkbff.weblog.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
