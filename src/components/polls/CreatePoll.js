"use client";

import React from "react";

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

const OptionForm = React.memo(
  ({ option, index, error, showRemove, onUpdate, onRemove }) => (
    <Box
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
          onChange={(e) => onUpdate(index, "text", e.target.value)}
          error={!!error}
          helperText={error}
        />
        {showRemove && (
          <IconButton onClick={() => onRemove(index)} sx={{ mt: 1 }}>
            <Delete />
          </IconButton>
        )}
      </Box>

      <TextField
        fullWidth
        label="Option Description (Optional)"
        placeholder="Add more details about this option..."
        value={option.description}
        onChange={(e) => onUpdate(index, "description", e.target.value)}
        size="small"
      />

      <TextField
        fullWidth
        label="Option Image URL (Optional)"
        placeholder="https://example.com/image.jpg"
        value={option.image}
        onChange={(e) => onUpdate(index, "image", e.target.value)}
        size="small"
      />
    </Box>
  )
);

OptionForm.displayName = "OptionForm";

const PollSettings = React.memo(({ settings, onSettingChange }) => (
  <FormGroup sx={{ mb: 3 }}>
    <FormControlLabel
      control={
        <Switch
          checked={settings.isPublic}
          onChange={(e) => onSettingChange("isPublic", e.target.checked)}
        />
      }
      label="Public Poll (Visible to everyone)"
    />

    <FormControlLabel
      control={
        <Switch
          checked={settings.allowMultiple}
          onChange={(e) => onSettingChange("allowMultiple", e.target.checked)}
        />
      }
      label="Allow Multiple Votes"
    />

    <FormControlLabel
      control={
        <Switch
          checked={settings.allowComments}
          onChange={(e) => onSettingChange("allowComments", e.target.checked)}
        />
      }
      label="Allow Comments"
    />

    <FormControlLabel
      control={
        <Switch
          checked={settings.showResults}
          onChange={(e) => onSettingChange("showResults", e.target.checked)}
        />
      }
      label="Show Results Before Voting"
    />
  </FormGroup>
));

PollSettings.displayName = "PollSettings";

function CreatePoll({
  formData,
  errors,
  optionIds,
  isLoading,
  error,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onSettingChange,
  onInputChange,
  onSubmit,
}) {
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

          <Box component="form" onSubmit={onSubmit}>
            {/* Poll Question */}
            <TextField
              fullWidth
              label="Poll Question *"
              value={formData.question}
              onChange={(e) => onInputChange("question", e.target.value)}
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
              onChange={(e) => onInputChange("description", e.target.value)}
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
                <OptionForm
                  key={optionIds[index]}
                  option={option}
                  index={index}
                  optionId={optionIds[index]}
                  error={errors[`option_${optionIds[index]}`]}
                  showRemove={formData.options.length > 2}
                  onUpdate={onUpdateOption}
                  onRemove={onRemoveOption}
                />
              ))}

              {formData.options.length < 10 && (
                <Button
                  startIcon={<Add />}
                  onClick={onAddOption}
                  sx={{ mb: 3 }}
                >
                  Add Option
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Poll Settings */}
            <Typography variant="h6" gutterBottom>
              Poll Settings
            </Typography>

            <PollSettings
              settings={formData.settings}
              onSettingChange={onSettingChange}
            />

            {/* Closing Time */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Closing Time (Optional)
              </Typography>
              <DateTimePicker
                value={formData.closesAt}
                onChange={(newValue) => onInputChange("closesAt", newValue)}
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

export default React.memo(CreatePoll);
