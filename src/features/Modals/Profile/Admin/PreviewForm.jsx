import { useEffect, useRef, useState } from "react";
import styles from "./styles/Preview.module.scss";
import { Button, Text } from "../../../../components";
import Section from "./SectionModal";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { getOutboundList } from "../../../../sections/Profile/Admin/Form/NewForm/NewForm";
import Complete from "../../../../assets/images/Complete.svg";

const operators = [
  { label: "match", value: "===" },
  { label: "match not", value: "!==" },
  // { label: "contains", value: "includes" },
  // { label: "does not contain", value: "!includes" },
  { label: "less than", value: "<" },
  { label: "greater than", value: ">" },
  { label: "less than or equal to", value: "<=" },
  { label: "greater than or equal to", value: ">=" },
];
const hasOptions = ["select", "checkbox", "radio"];

const PreviewForm = ({
  eventData,
  sections = [],
  open,
  meta = [],
  handleClose,
  showCloseBtn,
}) => {
  const [data, setdata] = useState(sections);
  const [activeSection, setactiveSection] = useState(
    data !== undefined ? data[0] : ""
  );
  const [isCompleted, setisCompleted] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const wrapperRef = useRef(null);

  let currentSection =
    data !== undefined
      ? data.find((section) => section._id === activeSection._id)
      : null;

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    constructSections();
  }, [sections]);

  const constructSections = () => {
    const newSections = data.map((section) => {
      return {
        ...section,
        isDisabled: section._id !== data[0]._id,
        fields: section.fields.map((field) => {
          return {
            ...field,
            onChangeValue: "",
          };
        }),
      };
    });
    setdata(newSections);
    setactiveSection(newSections[0]);
  };

  const handleClickOutside = (e) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(e.target)) {
      handleClose();
    }
  };

  const handleChange = (field, value) => {
    const updatedSections = data.map((section) => {
      const updatedFields = section.fields.map((fld) => {
        if (field._id === fld._id) {
          if (fld.type === "checkbox") {
            const updatedOnChangeValue = fld.onChangeValue.includes(value)
              ? fld.onChangeValue.filter((val) => val !== value)
              : [...fld.onChangeValue, value];

            return {
              ...fld,
              onChangeValue: updatedOnChangeValue,
            };
          } else {
            return {
              ...fld,
              onChangeValue: value,
            };
          }
        }
        return fld;
      });

      return {
        ...section,
        fields: updatedFields,
      };
    });

    const newSections = updatedSections.map((section) => {
      const isHavingFieldValidations = section?.validations?.filter(
        (valid) => valid.field_id
      );

      let isMatched = false;
      if (isHavingFieldValidations.length > 0) {
        isMatched = isHavingFieldValidations.some((valid) => {
          return section.fields.some((fld) => {
            return fld.onChangeValue === valid.values;
          });
        });
      }

      const nextSection = getOutboundList(data, section._id)?.nextSection;

      return {
        ...section,
        isDisabled: !(isMatched && nextSection),
      };
    });

    setdata(newSections);
  };

  const handleSubmit = () => {
    const formData = new FormData();

    data.forEach((section) => {
      if (isCompleted.includes(section._id)) {
        formData.append(`_id`, section._id);
        formData.append(`name`, section.name);
        section.fields.forEach((fld) => {
          formData.append("field_id", fld._id);
          formData.append("field_name", fld.name);
          formData.append("field_value", fld.onChangeValue);
        });
      }
    });

    formData.forEach((value, key) => {
      console.log(key + " " + value);
    });
  };

  const areRequiredFieldsFilled = () => {
    let isFilled = {
      status: true,
      message: "",
    };

    if (currentSection) {
      currentSection.fields.forEach((field) => {
        if (field.isRequired && !field.onChangeValue) {
          isFilled = {
            status: false,
            message: "Please fill all required fields",
          };
          return;
        }

        field.validations.forEach((valid) => {
          if (valid.type === "length") {
            if (!matchCondition(field, valid)) {
              const op = operators.find((op) => op.value === valid.operator);
              isFilled = {
                status: false,
                message: `${field.name} should ${op?.label} ${valid.type} ${valid.value}`,
              };
            }
          }
        });
      });
    }

    if (!isFilled.status) {
      alert(isFilled.message);
      return false;
    }

    return true;
  };

  const matchCondition = (field, valid) => {
    const fieldLength = hasOptions.includes(field.type)
      ? field.onChangeValue.split(",").length
      : field.onChangeValue.length;
    const operator = valid?.operator;
    const validLength =
      valid.type === "length" ? Number(valid?.value) : valid?.value;

    switch (operator) {
      case "===":
        return fieldLength === validLength;
      case "!==":
        return fieldLength !== validLength;
      case "includes":
        return field.onChangeValue?.includes(valid?.value);
      case "!includes":
        return !field.onChangeValue?.includes(valid.value);
      case "<":
        return fieldLength < validLength;
      case ">":
        return fieldLength > validLength;
      case "<=":
        return fieldLength <= validLength;
      case ">=":
        return fieldLength >= validLength;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  };

  const isMetaExist = () => {
    const paymentSection = meta.find((sec) => sec.name === "Payment Details");
    if (paymentSection) {
      paymentSection.isDisabled = false;
      paymentSection.validations[0].onBack = currentSection._id;
      return paymentSection;
    }
    return null;
  };

  const inboundList = () => {
    if (!currentSection) return null;
    let nextSection = currentSection?.validations[0]?.onNext;
    let backSection = currentSection.validations[0]?.onBack;
    const isHavingFieldValidations = currentSection?.validations?.filter(
      (valid) => valid.field_id
    );

    if (isHavingFieldValidations.length > 0) {
      const isMatched = isHavingFieldValidations.find((valid) => {
        return currentSection.fields?.find((fld) => {
          return fld.onChangeValue === valid.values;
        });
      });

      nextSection = isMatched ? isMatched?.onNext : nextSection;
      backSection = isMatched ? isMatched?.onBack : backSection;
    }

    if (isMetaExist() && currentSection?.name === "Payment Details") {
      const lastIsCompleted = isCompleted[isCompleted.length - 1];
      backSection = lastIsCompleted;
    }

    return {
      nextSection: data.find((sec) => sec._id === nextSection) || null,
      backSection: data.find((sec) => sec._id === backSection) || null,
    };
  };

  const onNext = () => {
    if (!currentSection) {
      return false;
    }

    if (!areRequiredFieldsFilled()) {
      return false;
    }

    const { nextSection } = inboundList();
    if (nextSection) {
      setisCompleted((prev) => [...prev, currentSection._id]);
      setactiveSection(nextSection);
    }

    if (!nextSection || nextSection === "submit") {
      setisCompleted((prev) => [...prev, currentSection._id, "Submitted"]);
      return handleSubmit();
    }
  };

  const onBack = () => {
    const { backSection } = inboundList();
    if (backSection) {
      setisCompleted((prev) => prev.filter((id) => id !== backSection._id));
      setactiveSection(backSection);
    }
  };

  const renderPaymentScreen = () => {
    const { eventType, receiverDetails, amount } = eventData;
    if (eventType === "Paid" && currentSection.name === "Payment Details") {
      return (
        <div
          style={{
            margin: "8px auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {receiverDetails.media && (
            <img
              src={URL.createObjectURL(receiverDetails.media)}
              alt={"QR-Code"}
              style={{
                width: 200,
                height: 200,
                objectFit: "contain",
              }}
            />
          )}
          <p
            style={{
              fontSize: 12,
              marginTop: 12,
              color: "lightgray",
            }}
          >
            Make the payment of{" "}
            <strong
              style={{
                color: "#fff",
              }}
            >
              &#8377;{amount}
            </strong>{" "}
            using QR-Code or UPI Id{" "}
            <strong
              style={{
                color: "#fff",
              }}
            >
              {receiverDetails.upi}
            </strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    open && (
      <div className={styles.mainPreview}>
        <div ref={wrapperRef} className={styles.previewContainer}>
          {showCloseBtn && (
            <Link onClick={handleClose} to={"/Events"}>
              <div className={styles.closeBtn}>
                <X />
              </div>
            </Link>
          )}
          <Text style={{ marginBottom: "20px" }}>
            {eventData?.title || "Preview Event"}
          </Text>
          {!isCompleted.includes("Submitted") ? (
            <div
              style={{
                width: "100%",
              }}
            >
              <div>
                <Text
                  style={{
                    alignSelf: "center",
                  }}
                  variant="secondary"
                >
                  {currentSection.name}
                </Text>
                <Text
                  style={{
                    cursor: "pointer",
                    padding: "6px 0",
                    fontSize: "11px",
                    opacity: "0.4",
                    marginBottom: "8px",
                  }}
                >
                  {currentSection.description}
                </Text>
              </div>
              {renderPaymentScreen()}
              <Section section={currentSection} handleChange={handleChange} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {inboundList() && inboundList().backSection && (
                  <Button style={{ marginRight: "10px" }} onClick={onBack}>
                    Back
                  </Button>
                )}

                <Button onClick={onNext}>
                  {inboundList() && inboundList().nextSection
                    ? "Next"
                    : "Submit"}
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <img
                src={Complete}
                alt="Complete"
                style={{ width: "400px", height: "400px", margin: "auto" }}
              />
              <Text
                variant={"secondary"}
                style={{
                  width: "60%",
                  fontSize: "14px",
                  alignSelf: "center",
                  textAlign: "center",
                  marginTop: "16px",
                  userSelect: "none",
                }}
              >
                Form Submitted Successfully! Thank you for your time.
              </Text>
            </div>
          )}
        </div>
      </div>
    )
  );
};
export default PreviewForm;
