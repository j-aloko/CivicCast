"use client";

import React, { useState } from "react";

import { Add, Delete, Schedule } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constant/constant";
import { usePolls } from "@/hooks/usePolls";

function CreatePoll() {
  const [formData, setFormData] = useState({
    closesAt: null,
    description: "",
    options: [
      { description: "", image: "", text: "" },
      { description: "", image: "", text: "" },
    ],
    question: "",
    settings: {
      allowComments: true,
      allowMultiple: false,
      isPublic: true,
      showResults: true,
    },
  });

  const [errors, setErrors] = useState({});
  const { createNewPoll, isLoading, error } = usePolls();
  const router = useRouter();

  // Generate unique IDs for options
  const [optionIds, setOptionIds] = useState([generateId(), generateId()]);

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({
        ...formData,
        options: [
          ...formData.options,
          { description: "", image: "", text: "" },
        ],
      });
      setOptionIds([...optionIds, generateId()]);
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      const newOptionIds = optionIds.filter((_, i) => i !== index);

      setFormData({
        ...formData,
        options: newOptions,
      });
      setOptionIds(newOptionIds);
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const handleSettingChange = (setting, value) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings,
        [setting]: value,
      },
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = "Poll question is required";
    }

    const validOptions = formData.options.filter((opt) => opt.text.trim());
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    formData.options.forEach((option, index) => {
      if (!option.text.trim() && index < 2) {
        newErrors[`option_${optionIds[index]}`] = "Option text is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Filter out empty options and prepare data for backend
      const pollData = {
        closesAt: formData.closesAt,
        description: formData.description.trim(),
        isPublic: formData.settings.isPublic,
        options: formData.options
          .filter((opt) => opt.text.trim()) // Remove empty options
          .map((opt) => ({
            description: opt.description?.trim() || null,
            image: opt.image?.trim() || null,
            text: opt.text.trim(),
          })),
        question: formData.question.trim(),
        settings: formData.settings,
      };

      const result = await createNewPoll(pollData);
      console.log("Poll creation result:", result);

      if (result.payload) {
        router.push(`${ROUTES.polls}/${result.payload.id}`);
      }
    } catch (err) {
      console.error("Error creating poll:", err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create New Poll
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Poll Question */}
            <TextField
              fullWidth
              label="Poll Question *"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              margin="normal"
              error={!!errors.question}
              helperText={errors.question}
              placeholder="What is your favorite programming language?"
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
              placeholder="Add more context about your poll..."
            />

            {/* Poll Options */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Options ({formData.options.length}/10) *
              </Typography>

              {errors.options && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.options}
                </Alert>
              )}

              {formData.options.map((option, index) => (
                <Box
                  key={optionIds[index]}
                  sx={{
                    alignItems: "flex-start",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mb: 2,
                    p: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                    <TextField
                      fullWidth
                      label={`Option ${index + 1} *`}
                      placeholder={`Enter option ${index + 1}`}
                      value={option.text}
                      onChange={(e) =>
                        updateOption(index, "text", e.target.value)
                      }
                      error={!!errors[`option_${optionIds[index]}`]}
                      helperText={errors[`option_${optionIds[index]}`]}
                    />
                    {formData.options.length > 2 && (
                      <IconButton
                        onClick={() => removeOption(index)}
                        sx={{ mt: 1 }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>

                  {/* Optional description for each option */}
                  <TextField
                    fullWidth
                    label="Option Description (Optional)"
                    placeholder="Add more details about this option..."
                    value={option.description}
                    onChange={(e) =>
                      updateOption(index, "description", e.target.value)
                    }
                    size="small"
                  />

                  {/* Optional image URL for each option */}
                  <TextField
                    fullWidth
                    label="Option Image URL (Optional)"
                    placeholder="https://example.com/image.jpg"
                    value={option.image}
                    onChange={(e) =>
                      updateOption(index, "image", e.target.value)
                    }
                    size="small"
                  />
                </Box>
              ))}

              {formData.options.length < 10 && (
                <Button startIcon={<Add />} onClick={addOption} sx={{ mb: 3 }}>
                  Add Option
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Poll Settings */}
            <Typography variant="h6" gutterBottom>
              Poll Settings
            </Typography>

            <FormGroup sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.isPublic}
                    onChange={(e) =>
                      handleSettingChange("isPublic", e.target.checked)
                    }
                  />
                }
                label="Public Poll (Visible to everyone)"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.allowMultiple}
                    onChange={(e) =>
                      handleSettingChange("allowMultiple", e.target.checked)
                    }
                  />
                }
                label="Allow Multiple Votes"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.allowComments}
                    onChange={(e) =>
                      handleSettingChange("allowComments", e.target.checked)
                    }
                  />
                }
                label="Allow Comments"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.showResults}
                    onChange={(e) =>
                      handleSettingChange("showResults", e.target.checked)
                    }
                  />
                }
                label="Show Results Before Voting"
              />
            </FormGroup>

            {/* Closing Time */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Closing Time (Optional)
              </Typography>
              <DateTimePicker
                value={formData.closesAt}
                onChange={(newValue) =>
                  setFormData({ ...formData, closesAt: newValue })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                minDateTime={new Date()}
                slots={{
                  openPickerIcon: Schedule,
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? "Creating Poll..." : "Create Poll"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}

export default CreatePoll;
