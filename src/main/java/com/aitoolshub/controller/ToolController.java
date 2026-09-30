package com.aitoolshub.controller;

import com.aitoolshub.model.Tool;
import com.aitoolshub.service.ToolService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tools")
@CrossOrigin(origins = "*")
public class ToolController {

    private final ToolService toolService;

    @Autowired
    public ToolController(ToolService toolService) {
        this.toolService = toolService;
    }

    // GET /api/tools
    @GetMapping
    public ResponseEntity<List<Tool>> getAllTools() {
        List<Tool> tools = toolService.getAllTools();
        return ResponseEntity.ok(tools);
    }

    // GET /api/tools/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Tool> getToolById(@PathVariable Long id) {
        Tool tool = toolService.getToolById(id);
        return ResponseEntity.ok(tool);
    }

    // POST /api/tools
    @PostMapping
    public ResponseEntity<Tool> createTool(@Valid @RequestBody Tool tool) {
        Tool createdTool = toolService.createTool(tool);
        return new ResponseEntity<>(createdTool, HttpStatus.CREATED);
    }

    // PUT /api/tools/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Tool> updateTool(@PathVariable Long id, @Valid @RequestBody Tool toolDetails) {
        Tool updatedTool = toolService.updateTool(id, toolDetails);
        return ResponseEntity.ok(updatedTool);
    }

    // DELETE /api/tools/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTool(@PathVariable Long id) {
        toolService.deleteTool(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/tools/search?keyword=
    @GetMapping("/search")
    public ResponseEntity<List<Tool>> searchTools(@RequestParam(required = false, defaultValue = "") String keyword) {
        List<Tool> results = toolService.searchTools(keyword);
        return ResponseEntity.ok(results);
    }

    // GET /api/tools/category/{category}
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Tool>> getToolsByCategory(@PathVariable String category) {
        List<Tool> tools = toolService.getToolsByCategory(category);
        return ResponseEntity.ok(tools);
    }

    // GET /api/tools/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getToolStatistics() {
        Map<String, Object> stats = toolService.getToolStatistics();
        return ResponseEntity.ok(stats);
    }
}
