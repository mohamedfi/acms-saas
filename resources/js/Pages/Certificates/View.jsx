import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CertificateView({ certificate }) {
  const [isExporting, setIsExporting] = useState(false);
  const certificateRef = useRef(null);

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

  const currentStyles = deepMerge(
    defaultStyles,
    certificate.customization || {}
  );

  const getElementStyle = (element) => {
    const style = currentStyles[element];
    if (!style) return {};

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

  const handleExportPDF = async () => {
    if (!certificateRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");

      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`certificate_${certificate.certificate_number}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          🏆 Certificate View
        </h2>
      }
    >
      <Head title={`Certificate: ${certificate.certificate_number}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header Actions */}
          <div className="mb-6 flex justify-between items-center">
            <Link
              href={route("certificates.index")}
              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
            >
              ← Back to Certificates
            </Link>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                🖨️ Print
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? "⏳ Exporting..." : "📄 Export PDF"}
              </button>
            </div>
          </div>

          {/* Certificate Display */}
          <div className="flex justify-center">
            <div
              ref={certificateRef}
              className="certificate-container bg-white shadow-2xl"
              style={{
                width: "842px", // A4 landscape width in pixels
                height: "595px", // A4 landscape height in pixels
                backgroundImage: certificate.background_image
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
              {/* Certificate Content */}
              <div
                className="text-center"
                style={{ zIndex: 10, maxWidth: "80%" }}
              >
                {/* Title */}
                <div style={getElementStyle("title")}>
                  CERTIFICATE OF COMPLETION
                </div>

                {/* Subtitle */}
                <div style={getElementStyle("subtitle")}>
                  This is to certify that
                </div>

                {/* Participant Name */}
                {certificate.participant_name && (
                  <div style={getElementStyle("participant_name")}>
                    {certificate.participant_name}
                  </div>
                )}

                {/* Course Details */}
                {certificate.course_name && (
                  <div style={getElementStyle("course_details")}>
                    has successfully completed the course
                    <br />
                    <strong>{certificate.course_name}</strong>
                  </div>
                )}

                {/* Company Name */}
                {certificate.company_name && (
                  <div style={getElementStyle("company_name")}>
                    from {certificate.company_name}
                  </div>
                )}

                {/* Dates */}
                {(certificate.completion_date || certificate.issue_date) && (
                  <div style={getElementStyle("dates")}>
                    {certificate.completion_date && (
                      <div>
                        Completed on:{" "}
                        {certificate.formatted_completion_date ||
                          new Date(
                            certificate.completion_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </div>
                    )}
                    {certificate.issue_date && (
                      <div>
                        Issued on:{" "}
                        {certificate.formatted_issue_date ||
                          new Date(certificate.issue_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Certificate Number */}
              <div style={getElementStyle("certificate_number")}>
                Certificate No: {certificate.certificate_number}
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Certificate Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Certificate Number
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {certificate.certificate_number}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {certificate.status_display}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Participant
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {certificate.participant_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {certificate.participant_email || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Course
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {certificate.course_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Company
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {certificate.company_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Completion Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(certificate.completion_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Issue Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(certificate.issue_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {certificate.description && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                    {certificate.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx="true">{`
        @media print {
          .certificate-container {
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 40px !important;
            box-shadow: none !important;
          }

          body * {
            visibility: hidden;
          }

          .certificate-container,
          .certificate-container * {
            visibility: visible;
          }

          .certificate-container {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}
