package com.aitoolshub.service;

import com.aitoolshub.exception.ResourceNotFoundException;
import com.aitoolshub.model.Tool;
import com.aitoolshub.repository.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ToolService {

    private final ToolRepository toolRepository;

    @Autowired
    public ToolService(ToolRepository toolRepository) {
        this.toolRepository = toolRepository;
    }

    public List<Tool> getAllTools() {
        return toolRepository.findAll();
    }

    public Tool getToolById(Long id) {
        return toolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tool not found with id: " + id));
    }

    public Tool createTool(Tool tool) {
        if (tool.getCreatedAt() == null) {
            tool.setCreatedAt(LocalDateTime.now());
        }
        return toolRepository.save(tool);
    }

    public Tool updateTool(Long id, Tool toolDetails) {
        Tool existingTool = getToolById(id);

        existingTool.setName(toolDetails.getName());
        existingTool.setDescription(toolDetails.getDescription());
        existingTool.setCategory(toolDetails.getCategory());
        existingTool.setUrl(toolDetails.getUrl());
        existingTool.setImageUrl(toolDetails.getImageUrl());
        existingTool.setPricing(toolDetails.getPricing());
        existingTool.setFeatures(toolDetails.getFeatures());

        return toolRepository.save(existingTool);
    }

    public void deleteTool(Long id) {
        Tool existingTool = getToolById(id);
        toolRepository.delete(existingTool);
    }

    public List<Tool> searchTools(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllTools();
        }
        return toolRepository.searchTools(keyword.trim());
    }

    public List<Tool> getToolsByCategory(String category) {
        if (category == null || category.trim().isEmpty() || category.equalsIgnoreCase("All")) {
            return getAllTools();
        }
        return toolRepository.findByCategoryIgnoreCase(category.trim());
    }

    public Map<String, Object> getToolStatistics() {
        Map<String, Object> stats = new HashMap<>();
        long totalTools = toolRepository.count();
        stats.put("totalTools", totalTools);

        List<Object[]> categoryCounts = toolRepository.countToolsByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] row : categoryCounts) {
            String categoryName = (String) row[0];
            Long count = (Long) row[1];
            categoryMap.put(categoryName, count);
        }
        stats.put("categoryCounts", categoryMap);

        // Count pricing distribution
        List<Tool> allTools = toolRepository.findAll();
        long freeCount = allTools.stream().filter(t -> "Free".equalsIgnoreCase(t.getPricing())).count();
        long freemiumCount = allTools.stream().filter(t -> "Freemium".equalsIgnoreCase(t.getPricing())).count();
        long paidCount = allTools.stream().filter(t -> "Paid".equalsIgnoreCase(t.getPricing())).count();

        Map<String, Long> pricingMap = new HashMap<>();
        pricingMap.put("Free", freeCount);
        pricingMap.put("Freemium", freemiumCount);
        pricingMap.put("Paid", paidCount);
        stats.put("pricingCounts", pricingMap);

        return stats;
    }
}
