"use client";

import React, { useState, useCallback } from "react";

import { useRouter } from "next/navigation";

import CreatePoll from "@/components/polls/CreatePoll";
import { ROUTES } from "@/constant/constant";
import { usePolls } from "@/hooks/usePolls";

function CreatePollContainer() {
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
  const [optionIds, setOptionIds] = useState([generateId(), generateId()]);

  const { createNewPoll, isLoading, error } = usePolls();
  const router = useRouter();

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  const addOption = useCallback(() => {
    if (formData.options.length < 10) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, { description: "", image: "", text: "" }],
      }));
      setOptionIds((prev) => [...prev, generateId()]);
    }
  }, [formData.options.length]);

  const removeOption = useCallback(
    (index) => {
      if (formData.options.length > 2) {
        setFormData((prev) => ({
          ...prev,
          options: prev.options.filter((_, i) => i !== index),
        }));
        setOptionIds((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [formData.options.length]
  );

  const updateOption = useCallback((index, field, value) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = {
        ...newOptions[index],
        [field]: value,
      };
      return {
        ...prev,
        options: newOptions,
      };
    });
  }, []);

  const handleSettingChange = useCallback((setting, value) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value,
      },
    }));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const validateForm = useCallback(() => {
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
  }, [formData.question, formData.options, optionIds]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      try {
        const pollData = {
          closesAt: formData.closesAt,
          description: formData.description.trim(),
          isPublic: formData.settings.isPublic,
          options: formData.options
            .filter((opt) => opt.text.trim())
            .map((opt) => ({
              description: opt.description?.trim() || null,
              image: opt.image?.trim() || null,
              text: opt.text.trim(),
            })),
          question: formData.question.trim(),
          settings: formData.settings,
        };

        const result = await createNewPoll(pollData);

        if (result.payload) {
          router.push(`${ROUTES.polls}/${result.payload.id}`);
        }
      } catch (err) {
        console.error("Error creating poll:", err);
      }
    },
    [formData, validateForm, createNewPoll, router]
  );

  return (
    <CreatePoll
      formData={formData}
      errors={errors}
      optionIds={optionIds}
      isLoading={isLoading}
      error={error}
      onAddOption={addOption}
      onRemoveOption={removeOption}
      onUpdateOption={updateOption}
      onSettingChange={handleSettingChange}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );
}

export default CreatePollContainer;
