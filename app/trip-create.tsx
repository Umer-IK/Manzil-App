import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import tripFormStyles from "./styles/tripFormStyles";
import { Ionicons } from "@expo/vector-icons";

export default function TripCreateScreen() {
  const { control, handleSubmit, setValue, watch } = useForm();
  const router = useRouter();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Function to handle Start Date selection
  const handleStartDateChange = (selectedDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time

    if (selectedDate < today) {
      alert("Start Date cannot be before today.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    setValue("startDate", formattedDate);

    // Reset End Date when a new Start Date is chosen
    setValue("endDate", "");
    setShowStartDatePicker(false);
  };

  // Function to handle End Date selection
  const handleEndDateChange = (selectedDate: Date) => {
    if (!startDate) {
      alert("Please select a Start Date first.");
      return;
    }

    const start = new Date(startDate);
    const maxEndDate = new Date(start);
    maxEndDate.setDate(start.getDate() + 7); // Limit to 7 days after Start Date

    if (selectedDate < start || selectedDate > maxEndDate) {
      alert("End Date must be within 7 days after the Start Date.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    setValue("endDate", formattedDate);
    setShowEndDatePicker(false);
  };

  const handleBackPress = () => {
    router.push("/mytrips");
  };

  const onSubmit = (data: any) => {
    router.push({
      pathname: "/trip-itinerary",
      params: {
        from: data.from,
        to: data.to,
        startDate: data.startDate,
        endDate: data.endDate,
        transport: data.transport,
      },
    });
  };

  return (
    <ScrollView style={tripFormStyles.container}>
      <TouchableOpacity
        style={tripFormStyles.backButton}
        onPress={handleBackPress}
      >
        <Ionicons name="arrow-back" size={24} color="rgb(56, 123, 167)" />
      </TouchableOpacity>
      <Text style={tripFormStyles.title}>Create a Trip</Text>

      {/* From */}
      <Text style={tripFormStyles.label}>From:</Text>
      <Controller
        control={control}
        name="from"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value}
            style={tripFormStyles.picker}
            onValueChange={(itemValue) => onChange(itemValue)}
          >
            <Picker.Item label="Select starting location" value="" />
            <Picker.Item label="Lahore" value="Lahore" />
            <Picker.Item label="Karachi" value="Karachi" />
            <Picker.Item label="Islamabad" value="Islamabad" />
            <Picker.Item label="Quetta" value="Quetta" />
          </Picker>
        )}
      />

      {/* To */}
      <Text style={tripFormStyles.label}>To:</Text>
      <Controller
        control={control}
        name="to"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value}
            style={tripFormStyles.picker}
            onValueChange={(itemValue) => onChange(itemValue)}
          >
            <Picker.Item label="Select destination" value="" />
            <Picker.Item label="Lahore" value="Lahore" />
            <Picker.Item label="Karachi" value="Karachi" />
            <Picker.Item label="Islamabad" value="Islamabad" />
            <Picker.Item label="Quetta" value="Quetta" />
          </Picker>
        )}
      />

      {/* Start Date */}
      <Text style={tripFormStyles.label}>Start Date:</Text>
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <TextInput
          style={tripFormStyles.input}
          placeholder="YYYY-MM-DD"
          value={startDate}
          editable={false}
        />
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate ? new Date(startDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={(event, date) => date && handleStartDateChange(date)}
        />
      )}

      {/* End Date */}
      <Text style={tripFormStyles.label}>End Date:</Text>
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <TextInput
          style={tripFormStyles.input}
          placeholder="YYYY-MM-DD"
          value={endDate}
          editable={false}
        />
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={
            endDate
              ? new Date(endDate)
              : startDate
              ? new Date(startDate)
              : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={startDate ? new Date(startDate) : new Date()}
          maximumDate={
            startDate
              ? new Date(
                  new Date(startDate).setDate(
                    new Date(startDate).getDate() + 6
                  )
                )
              : new Date()
          }
          onChange={(event, date) => date && handleEndDateChange(date)}
        />
      )}

      {/* Transport Mode */}
      <Text style={tripFormStyles.label}>Mode of Transport:</Text>
      <Controller
        control={control}
        name="transport"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value}
            style={tripFormStyles.picker}
            onValueChange={(itemValue) => onChange(itemValue)}
          >
            <Picker.Item label="Select a mode of transport" value="" />
            <Picker.Item label="Public Transport Bus" value="Public Transport Bus" />
            <Picker.Item label="Car" value="Car" />
          </Picker>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={tripFormStyles.button_generate}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={tripFormStyles.buttonText}>Generate Itinerary</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
