import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function Customize({ certificate, backgroundImages = [] }) {
  const [previewStyles, setPreviewStyles] = useState({});
  const [selectedElement, setSelectedElement] = useState("title");
  const [previewImage, setPreviewImage] = useState(null);

  const { data, setData, post, processing, errors } = useForm({
    customization: certificate.customization || {},
    background_image: null,
    selected_background_image: certificate.background_image || "",
  });

  // Default styles
  const defaultStyles = {
    title: {
      font_family: "Times New Roman",
      font_size: "3em",
      color: "#8b4513",
      position: { top: "20%", left: "50%" },
      text_align: "center",
    },
    subtitle: {
      font_family: "Times New Roman",
      font_size: "1.5em",
      color: "#34495e",
      position: { top: "35%", left: "50%" },
      text_align: "center",
    },
    participant_name: {
      font_family: "Times New Roman",
      font_size: "2.5em",
      color: "#2c3e50",
      position: { top: "45%", left: "50%" },
      text_align: "center",
      underline: true,
      underline_color: "#e74c3c",
    },
    course_details: {
      font_family: "Times New Roman",
      font_size: "1.3em",
      color: "#34495e",
      position: { top: "60%", left: "50%" },
      text_align: "center",
    },
    company_name: {
      font_family: "Times New Roman",
      font_size: "1.2em",
      color: "#7f8c8d",
      position: { top: "70%", left: "50%" },
      text_align: "center",
      italic: true,
    },
    dates: {
      font_family: "Times New Roman",
      font_size: "1.1em",
      color: "#34495e",
      position: { top: "80%", left: "50%" },
      text_align: "center",
    },
    certificate_number: {
      font_family: "Times New Roman",
      font_size: "0.9em",
      color: "#7f8c8d",
      position: { bottom: "20px", right: "20px" },
      text_align: "right",
    },
  };

  // Deep merge customization with defaults
  const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };

  // Move currentStyles inside the component to recalculate on every render
  const currentStyles = deepMerge(defaultStyles, data.customization || {});

  const fontOptions = [
    "Times New Roman",
    "Arial",
    "Helvetica",
    "Georgia",
    "Verdana",
    "Courier New",
    "Brush Script MT",
    "Comic Sans MS",
    "Impact",
    "Trebuchet MS",
  ];

  const textAlignOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ];

  const elementLabels = {
    title: "Certificate Title",
    subtitle: "Subtitle",
    participant_name: "Participant Name",
    course_details: "Course Details",
    company_name: "Company Name",
    dates: "Dates",
    certificate_number: "Certificate Number",
  };

  const updateStyle = (element, property, value) => {
    const newCustomization = { ...data.customization };
    if (!newCustomization[element]) {
      newCustomization[element] = {};
    }
    newCustomization[element][property] = value;
    setData("customization", newCustomization);
  };

  const updatePosition = (element, axis, value) => {
    const newCustomization = { ...data.customization };
    if (!newCustomization[element]) {
      newCustomization[element] = {};
    }
    if (!newCustomization[element].position) {
      newCustomization[element].position = {};
    }
    newCustomization[element].position[axis] = value;
    setData("customization", newCustomization);
  };

  const resetElement = (element) => {
    const newCustomization = { ...data.customization };
    delete newCustomization[element];
    setData("customization", newCustomization);
  };

  const resetAll = () => {
    setData("customization", {});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("certificates.save-customization", certificate.id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData("background_image", file);
      setData("selected_background_image", "");
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageSelect = (e) => {
    const selectedImage = e.target.value;
    setData("selected_background_image", selectedImage);
    setData("background_image", null);
    setPreviewImage(null);
  };

  const getPreviewStyle = (element) => {
    const style = currentStyles[element];
    if (!style) {
      return {
        fontFamily: defaultStyles[element]?.font_family,
        fontSize: defaultStyles[element]?.font_size,
        color: defaultStyles[element]?.color,
        textAlign: defaultStyles[element]?.text_align,
        position: "absolute",
        transform: "translate(-50%, -50%)",
        top: defaultStyles[element]?.position?.top,
        left: defaultStyles[element]?.position?.left,
        bottom: defaultStyles[element]?.position?.bottom,
        right: defaultStyles[element]?.position?.right,
        fontWeight: "bold",
        zIndex: 10,
      };
    }

    return {
      fontFamily: style.font_family || defaultStyles[element]?.font_family,
      fontSize: style.font_size || defaultStyles[element]?.font_size,
      color: style.color || defaultStyles[element]?.color,
      textAlign: style.text_align || defaultStyles[element]?.text_align,
      position: "absolute",
      transform: "translate(-50%, -50%)",
      top: style.position?.top || defaultStyles[element]?.position?.top,
      left: style.position?.left || defaultStyles[element]?.position?.left,
      bottom:
        style.position?.bottom || defaultStyles[element]?.position?.bottom,
      right: style.position?.right || defaultStyles[element]?.position?.right,
      fontWeight: "bold",
      zIndex: 10,
      ...(style.underline && {
        textDecoration: "underline",
        textDecorationColor: style.underline_color || "#e74c3c",
        textDecorationThickness: "3px",
      }),
      ...(style.italic && { fontStyle: "italic" }),
    };
  };

  return (
    <AuthenticatedLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Customize Certificate</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={resetAll}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Reset All
                  </button>
                  <PrimaryButton onClick={handleSubmit} disabled={processing}>
                    Save Customization
                  </PrimaryButton>
                </div>
              </div>

              {/* Live Preview - Full Width */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                <div className="flex justify-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                  <div
                    className="certificate-preview bg-white shadow-2xl"
                    style={{
                      width: "842px", // A4 landscape width in pixels
                      height: "595px", // A4 landscape height in pixels
                      backgroundImage: previewImage
                        ? `url(${previewImage})`
                        : certificate.background_image
                        ? `url(${
                            certificate.background_image.startsWith("http")
                              ? certificate.background_image
                              : `${window.location.origin}/storage/${certificate.background_image}`
                          })`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      fontFamily: '"Times New Roman", serif',
                      color: "#2c3e50",
                      padding: "40px",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Certificate Content - Using Dynamic Styles */}
                    <div style={getPreviewStyle("title")}>
                      CERTIFICATE OF COMPLETION
                    </div>
                    <div style={getPreviewStyle("subtitle")}>
                      This is to certify that
                    </div>
                    {certificate.participant_name && (
                      <div style={getPreviewStyle("participant_name")}>
                        {certificate.participant_name}
                      </div>
                    )}
                    {certificate.course_name && (
                      <div style={getPreviewStyle("course_details")}>
                        has successfully completed the course
                        <br />
                        <strong>{certificate.course_name}</strong>
                      </div>
                    )}
                    {certificate.company_name && (
                      <div style={getPreviewStyle("company_name")}>
                        from {certificate.company_name}
                      </div>
                    )}
                    {(certificate.completion_date ||
                      certificate.issue_date) && (
                      <div style={getPreviewStyle("dates")}>
                        {certificate.completion_date && (
                          <div>
                            Completed on:{" "}
                            {certificate.formatted_completion_date ||
                              (certificate.completion_date
                                ? new Date(
                                    certificate.completion_date
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "")}
                          </div>
                        )}
                        {certificate.issue_date && (
                          <div>
                            Issued on:{" "}
                            {certificate.formatted_issue_date ||
                              (certificate.issue_date
                                ? new Date(
                                    certificate.issue_date
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "")}
                          </div>
                        )}
                      </div>
                    )}
                    <div style={getPreviewStyle("certificate_number")}>
                      Certificate No: {certificate.certificate_number}
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Panels - Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Background Image Panel */}
                <div className="space-y-6">
                  {/* Background Image Section */}
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h3 className="text-lg font-semibold mb-4">
                      Background Image
                    </h3>

                    {/* Current Background Image Preview */}
                    {certificate.background_image && (
                      <div className="mb-4">
                        <InputLabel value="Current Background Image" />
                        <div className="relative w-full max-w-md">
                          <img
                            src={
                              certificate.background_image.startsWith("http")
                                ? certificate.background_image
                                : `${window.location.origin}/storage/${certificate.background_image}`
                            }
                            alt="Current Background"
                            className="w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                            onError={(e) => {
                              e.target.src = `${window.location.origin}/images/default-certificate-bg.jpg`;
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload New Image */}
                    <div className="mb-4">
                      <InputLabel value="Upload New Background Image" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {previewImage && (
                        <div className="mt-2">
                          <InputLabel value="Preview" />
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full max-w-md h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                          />
                        </div>
                      )}
                    </div>

                    {/* Select Existing Image */}
                    {backgroundImages.length > 0 && (
                      <div>
                        <InputLabel value="Or Select Existing Image" />
                        <select
                          value={data.selected_background_image || ""}
                          onChange={handleImageSelect}
                          className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        >
                          <option value="">Choose an existing image...</option>
                          {backgroundImages.map((image) => (
                            <option
                              key={image.filename}
                              value={
                                image.type === "uploaded"
                                  ? `certificate-backgrounds/${image.filename}`
                                  : image.filename
                              }
                            >
                              {image.name} ({image.type})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customization Tools Panel */}
                <div className="space-y-6">
                  {/* Element Selection */}
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h3 className="text-lg font-semibold mb-4">
                      Select Element to Customize
                    </h3>
                    <select
                      value={selectedElement}
                      onChange={(e) => setSelectedElement(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md"
                    >
                      {Object.entries(elementLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Customization Controls */}
                  {selectedElement && (
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                      <h3 className="text-lg font-semibold mb-4">
                        Customize {elementLabels[selectedElement]}
                      </h3>

                      {/* Font Family */}
                      <div className="mb-4">
                        <InputLabel value="Font Family" />
                        <select
                          value={
                            data.customization?.[selectedElement]
                              ?.font_family ||
                            defaultStyles[selectedElement]?.font_family ||
                            ""
                          }
                          onChange={(e) =>
                            updateStyle(
                              selectedElement,
                              "font_family",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {fontOptions.map((font) => (
                            <option key={font} value={font}>
                              {font}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Font Size */}
                      <div className="mb-4">
                        <InputLabel value="Font Size" />
                        <input
                          type="text"
                          value={
                            data.customization?.[selectedElement]?.font_size ||
                            defaultStyles[selectedElement]?.font_size ||
                            ""
                          }
                          onChange={(e) =>
                            updateStyle(
                              selectedElement,
                              "font_size",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 2em, 24px, 1.5rem"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      {/* Color */}
                      <div className="mb-4">
                        <InputLabel value="Color" />
                        <input
                          type="color"
                          value={
                            data.customization?.[selectedElement]?.color ||
                            defaultStyles[selectedElement]?.color ||
                            "#000000"
                          }
                          onChange={(e) =>
                            updateStyle(
                              selectedElement,
                              "color",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full h-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Text Alignment */}
                      <div className="mb-4">
                        <InputLabel value="Text Alignment" />
                        <select
                          value={
                            data.customization?.[selectedElement]?.text_align ||
                            defaultStyles[selectedElement]?.text_align ||
                            "center"
                          }
                          onChange={(e) =>
                            updateStyle(
                              selectedElement,
                              "text_align",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {textAlignOptions.map((align) => (
                            <option key={align.value} value={align.value}>
                              {align.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Position Controls */}
                      <div className="mb-4">
                        <InputLabel value="Position" />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400">
                              Top
                            </label>
                            <input
                              type="text"
                              value={
                                data.customization?.[selectedElement]?.position
                                  ?.top ||
                                defaultStyles[selectedElement]?.position?.top ||
                                ""
                              }
                              onChange={(e) =>
                                updatePosition(
                                  selectedElement,
                                  "top",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 20%, 100px"
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400">
                              Left
                            </label>
                            <input
                              type="text"
                              value={
                                data.customization?.[selectedElement]?.position
                                  ?.left ||
                                defaultStyles[selectedElement]?.position
                                  ?.left ||
                                ""
                              }
                              onChange={(e) =>
                                updatePosition(
                                  selectedElement,
                                  "left",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 50%, 200px"
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Special Options */}
                      {(selectedElement === "participant_name" ||
                        selectedElement === "company_name") && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-4">
                            {selectedElement === "participant_name" && (
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    data.customization?.[selectedElement]
                                      ?.underline || false
                                  }
                                  onChange={(e) =>
                                    updateStyle(
                                      selectedElement,
                                      "underline",
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                  Underline
                                </span>
                              </label>
                            )}
                            {selectedElement === "company_name" && (
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    data.customization?.[selectedElement]
                                      ?.italic || false
                                  }
                                  onChange={(e) =>
                                    updateStyle(
                                      selectedElement,
                                      "italic",
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                  Italic
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Reset Button */}
                      <button
                        onClick={() => resetElement(selectedElement)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reset {elementLabels[selectedElement]}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
