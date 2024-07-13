import { useState, useRef } from "react";
import { Button, Input, Text, Section } from "../../../../../components";
import { PreviewForm } from "../../../../../features";
import styles from "./styles/NewForm.module.scss";
import Switch from "react-switch";
import moment from "moment";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { nanoid } from "nanoid";

export const getOutboundList = (array, index) => {
  const getIndex = array.findIndex((sec) => sec._id === index);

  const prv_element = array[getIndex - 1];
  const next_element = array[getIndex + 1];

  const outbound = {
    nextSection: next_element || null,
    backSection: prv_element || null,
  };
  return outbound;
};

const TEAM_SIZE = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
];

function NewForm() {
  const scrollRef = useRef(null);
  const [isVisibility, setisVisibility] = useState(true);
  const [data, setdata] = useState({
    _id: nanoid(),
    title: "",
    logoLink: "",
    eventDate: "",
    eventType: "Free",
    receiverDetails: {
      media: "",
      upi: "",
    },
    amount: "",
    relatedEvent: "",
    participationType: "",
    minSize: "",
    maxSize: "",
    priority: "",
    description: "",
    successMessage: "",
    maxReg: "",
    openDT: "",
    isRegEnd: false,
    isEventPast: false,
    isPublic: false,
  });
  const [sections, setsections] = useState([
    {
      _id: nanoid(),
      name: "Basic Details",
      description: "Enter your basic details here",
      isDisabled: false,
      validations: [
        {
          _id: nanoid(),
          field_id: null, // Field_ID
          onNext: null, // Submit, Section_ID
          onBack: null, // Back, Section_ID
          values: null, // [value1, value2]
        },
      ],
      fields: [
        {
          _id: nanoid(),
          name: "",
          type: "",
          value: "",
          isRequired: true,
          validations: [
            {
              _id: nanoid(),
              type: null, //length, pattern, range
              value: null,
              operator: null, //<,>,<=,>=,===,!==
              message: "",
            },
          ],
        },
      ],
    },
  ]);
  const [paymentSection, setpaymentSection] = useState(null);
  const [showPreview, setshowPreview] = useState(false);

  const isValidSections = () => {
    return sections.every((section) =>
      section.fields.every((field) => {
        if (
          !field.name ||
          !field.type ||
          (field.type !== "file" && field.type !== "image" && !field.value)
        ) {
          return false;
        }

        if (["radio", "checkbox", "select"].includes(field.type)) {
          return field.validations.every(
            (validation) =>
              validation.type && validation.value && validation.operator
          );
        }

        return true;
      })
    );
  };

  const isValidEvent = () => {
    if (!data.title) {
      alert("Title is required.");
      return false;
    }

    if (!data.logoLink) {
      alert("Logo link is required.");
      return false;
    }
    if (!data.eventDate) {
      alert("Event date is required.");
      return false;
    }
    if (!data.eventType) {
      alert("Event type is required.");
      return false;
    }
    if (!data.relatedEvent) {
      alert("Related event is required.");
      return false;
    }
    if (!data.participationType) {
      alert("Participation type is required.");
      return false;
    }
    if (!data.priority) {
      alert("Priority is required.");
      return false;
    }
    if (!data.description) {
      alert("Description is required.");
      return false;
    }
    if (!data.successMessage) {
      alert("Success message is required.");
      return false;
    }
    if (!data.maxReg) {
      alert("Maximum registration is required.");
      return false;
    }

    if (data.eventType === "Paid") {
      if (!data.amount) {
        alert("Amount is required.");
        return false;
      }

      if (!data.receiverDetails.media) {
        alert("Media is required.");
        return false;
      }

      if (!data.receiverDetails.upi) {
        alert("UPI is required.");
        return false;
      }
    }

    if (data.participationType === "Team") {
      if (!data.maxSize) {
        alert("Maximum team size is required.");
        return false;
      }

      if (!data.minSize) {
        alert("Minimum team size is required.");
        return false;
      }
    }

    return true;
  };

  const onSaveEvent = () => {
    if (isValidEvent()) {
      const form = {
        ...data,
        sections,
      };
      console.log("form", form);
    }
  };

  const onAddSection = () => {
    const lastSection = sections[sections.length - 1];
    const sectionName = prompt("Enter Section Name");
    if (sectionName) {
      if (lastSection) {
        const newSectionID = nanoid();
        const updatedLastSection = {
          ...lastSection,
        };

        updatedLastSection.validations[0] = {
          _id: nanoid(),
          field_id: null,
          onNext: newSectionID,
          onBack: lastSection.validations[0]?.onBack || null,
          values: null,
        };

        const newSection = {
          name: sectionName,
          _id: newSectionID,
          description: "",
          isDisabled: false,
          validations: [
            {
              _id: nanoid(),
              field_id: null,
              onNext: null,
              onBack: lastSection._id,
              values: null,
            },
          ],
          fields: [
            {
              _id: nanoid(),
              name: "",
              type: "",
              value: "",
              isRequired: true,
              validations: [],
            },
          ],
        };
        setsections([
          ...sections.slice(0, sections.length - 1),
          updatedLastSection,
          newSection,
        ]);
      } else {
        alert("Functionality not implemented yet.");
      }
      setTimeout(() => {
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  };

  const handleChangeTeamSize = (value) => {
    if (value < 1 || !value) {
      setdata({ ...data, maxSize: "" });
      setsections(
        sections.filter((section) => section.name !== "Team Members")
      );
    }
    if (value === 0 || value > 7) {
      alert("Team size should be between 1 and 7.");
    } else {
      if (value > 0 && value <= 7) {
        setdata({ ...data, maxSize: value });

        const fields = Array.from({ length: value }, (_, index) => [
          {
            _id: nanoid(),
            name: `Enter ${getOrdinalSuffix(index + 1)} Member Name`,
            type: "text",
            value: "Enter Member Name",
            isRequired: index < data.minSize ? true : false,
            validations: [],
          },
          {
            _id: nanoid(),
            name: `Enter ${getOrdinalSuffix(index + 1)} Member Email`,
            type: "text",
            value: "Enter Email",
            isRequired: index < data.minSize ? true : false,
            validations: [],
          },
          {
            _id: nanoid(),
            name: `Enter ${getOrdinalSuffix(index + 1)} Member Roll Number`,
            type: "number",
            value: "Enter Roll Number",
            isRequired: index < data.minSize ? true : false,
            validations: [],
          },
        ]).flat();
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
          const newSectionID = nanoid();
          const updatedLastSection = {
            ...lastSection,
            validations: [
              {
                _id: nanoid(),
                field_id: null,
                onNext: newSectionID,
                onBack: lastSection.validations[0]?.onBack || null,
                values: null,
              },
            ],
          };
          const newSection = {
            _id: newSectionID,
            name: "Team Members",
            fields: fields,
            description: "Enter your team members details here",
            isDisabled: true,
            validations: [
              {
                _id: nanoid(),
                field_id: null,
                onNext: null,
                onBack: lastSection._id,
                values: null,
              },
            ],
          };

          const isHavingTeamSection = sections.some(
            (section) => section.name === "Team Members"
          );

          if (isHavingTeamSection) {
            const updatedSections = sections.map((section) => {
              if (section.name === "Team Members") {
                return {
                  ...section,
                  fields: fields,
                };
              }
              return section;
            });
            setsections(updatedSections);
          } else {
            const removed = sections.filter(
              (section) => section._id !== lastSection._id
            );
            setsections([...removed, updatedLastSection, newSection]);
          }
        }
      }
    }
  };

  const getOrdinalSuffix = (num) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = num % 100;
    const suffix =
      suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
    return `${num}${suffix}`;
  };

  const handleChangeMinSize = (value) => {
    if (value < 1 || !value) {
      setdata({ ...data, minSize: "1" });
    }
    if (value === 0 || value >= 7) {
      alert("Team size should be between 1 and 7.");
      setdata({ ...data, minSize: "1" });
    }
    if (data.maxSize > 0 && data.maxSize < value) {
      alert("Team min size should be less than max");
      setdata({ ...data, minSize: "1" });
    } else {
      const isHavingTeamSection = sections.some(
        (section) => section.name === "Team Members"
      );
      if (isHavingTeamSection) {
        const updatedSections = sections.map((section) => {
          if (section.name === "Team Members") {
            const updatedFields = section.fields.map((fld, idx) => {
              return {
                ...fld,
                isRequired: idx < value * 3 ? true : false,
              };
            });

            return {
              ...section,
              fields: updatedFields,
            };
          }
          return section;
        });
        setsections(updatedSections);
      }
      setdata({ ...data, minSize: value });
    }
  };

  const handleSaveSection = () => {
    if (isValidSections()) {
      console.log("Sections", sections);
    } else {
      alert("Fill all the form fields, including conditions");
    }
  };

  const onChangeEventType = (value) => {
    setdata({ ...data, eventType: value, amount: "" });

    if (value === "Paid") {
      setpaymentSection({
        _id: nanoid(),
        name: "Payment Details",
        description:
          "Make the payment to attached UPI ID or Scan the QR code. In the end, Share the complete detailes with us!",
        isDisabled: true,
        validations: [
          {
            _id: nanoid(),
            field_id: null,
            onNext: null,
            onBack: null,
            values: null,
          },
        ],
        fields: [
          {
            _id: nanoid(),
            name: "Enter UPI ID",
            type: "text",
            value: "Enter UPI ID",
            isRequired: true,
            validations: [],
          },
          {
            _id: nanoid(),
            name: "Paid Amount",
            type: "number",
            value: "Enter Amount Paid",
            isRequired: true,
            validations: [],
          },
          {
            _id: nanoid(),
            name: "Transaction ID",
            type: "text",
            value: "Enter Transaction ID",
            isRequired: true,
            validations: [],
          },
        ],
      });
    } else {
      setpaymentSection(null);
    }
  };

  const constructForPreview = () => {
    const formatedData = [...sections];

    if (paymentSection && data.eventType === "Paid") {
      paymentSection.isDisabled = true;
      formatedData.forEach((section) => {
        section.validations.forEach((validation) => {
          if (!validation.onNext) {
            validation.onNext = paymentSection._id;
          }
        });
      });

      formatedData.push(paymentSection);
      return formatedData;
    }

    return formatedData;
  };

  const handleChangeParticipantType = (value) => {
    const isHavingTeamSection = sections.some(
      (section) => section.name === "Team Members"
    );
    if (isHavingTeamSection) {
      const isConfirm = confirm(
        "Are you sure you want to change the participation type? All the data will be lost."
      );
      if (isConfirm) {
        setdata({
          ...data,
          participationType: value,
          minSize: "",
          maxSize: "",
        });
        const removedSection = sections.filter(
          (section) => section.name !== "Team Members"
        );
        setsections(removedSection);
        if (removedSection.length === 0) {
          setsections([
            {
              _id: nanoid(),
              name: "Basic Details",
              description: "Enter your basic details here",
              isDisabled: false,
              validations: [
                {
                  _id: nanoid(),
                  field_id: null,
                  onNext: null,
                  onBack: null,
                  values: null,
                },
              ],
              fields: [
                {
                  _id: nanoid(),
                  name: "",
                  type: "",
                  value: "",
                  isRequired: true,
                  validations: [
                    {
                      _id: nanoid(),
                      type: null,
                      value: null,
                      operator: null,
                      message: "",
                    },
                  ],
                },
              ],
            },
          ]);
        }
      }
    } else {
      setdata({
        ...data,
        participationType: value,
        minSize: "",
        maxSize: "",
      });
    }
  };

  const handlePreview = () => {
    if (isValidEvent()) {
      if (isValidSections()) {
        setshowPreview(!showPreview);
      } else {
        alert("Section is not valid. Please fill all the fields.");
      }
    } else {
      console.log("Invalid Event");
    }
  };
  
  return (
    <div
      style={{
        width: "100%",
        marginLeft: "70px",
      }}
    >
      <div className={styles.formHeader}>
        <div className={styles.buttonContainer}>
          <h3 className={styles.headInnerText}>
            <span>New</span> Form
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              marginRight: "12px",
            }}
          >
            {isVisibility ? (
              <IoSettingsSharp
                size={20}
                color="#FF8A00"
                style={{ cursor: "pointer", marginTop: "10px" }}
                onClick={() => setisVisibility(!isVisibility)}
              />
            ) : (
              <IoSettingsOutline
                size={20}
                style={{ cursor: "pointer", marginTop: "10px" }}
                color="#fff"
                onClick={() => setisVisibility(!isVisibility)}
              />
            )}
          </div>

          <Button onClick={onSaveEvent}>Save</Button>
          <Button isLoading={false} onClick={handlePreview} variant="secondary">
            {showPreview ? "Hide" : "Preview"}
          </Button>
        </div>
      </div>
      {isVisibility && (
        <div
          style={{
            backgroundColor: "rgba(128, 127, 126, 0.066)",
            width: "86%",
            margin: ".5em 0",
            padding: "1.6em",
            borderRadius: "8px",
            marginBottom: "1em",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <label
              style={{
                color: "#fff",
                margin: "4px 0",
                fontSize: ".8em",
                opacity: data.isPublic ? "1" : ".6",
                transition: "all .4s",
              }}
            >
              Public Mode (Public/Private)
            </label>
            <Switch
              checked={data.isPublic}
              width={36}
              height={18}
              onColor="#FF8A00"
              checkedIcon={false}
              placeholder="Mode (Public/Private)"
              uncheckedIcon={false}
              title="Mode (Public/Private)"
              onChange={() => {
                setdata({
                  ...data,
                  isPublic: !data.isPublic,
                });
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "1em 0",
            }}
          >
            <label
              style={{
                color: "#fff",
                margin: "4px 0",
                fontSize: ".8em",
                opacity: data.isRegEnd ? "1" : ".6",
                transition: "all .4s",
              }}
            >
              Close Event Registration
            </label>
            <Switch
              checked={data.isRegEnd}
              width={36}
              height={18}
              onColor="#FF8A00"
              checkedIcon={false}
              placeholder="Close Event Registration"
              uncheckedIcon={false}
              title="Close Event Registration"
              onChange={() => {
                setdata({
                  ...data,
                  isRegEnd: !data.isRegEnd,
                });
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <label
              style={{
                color: "#fff",
                margin: "4px 0",
                fontSize: ".8em",
                opacity: data.isEventPast ? "1" : ".6",
                transition: "all .4s",
              }}
            >
              Event Past/Ongoing
            </label>
            <Switch
              checked={data.isEventPast}
              width={36}
              height={18}
              onColor="#FF8A00"
              checkedIcon={false}
              placeholder="Event Past/Ongoing"
              uncheckedIcon={false}
              title="Event Past/Ongoing"
              onChange={() => {
                setdata({
                  ...data,
                  isEventPast: !data.isEventPast,
                });
              }}
            />
          </div>
        </div>
      )}
      <div
        style={{
          height: "420px",
          overflow: "hidden scroll",
          scrollbarWidth: "none",
          marginBottom: "50px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              width: "45%",
            }}
          >
            <Input
              placeholder="Enter Form Name"
              label="Form Name"
              value={data.title}
              className={styles.formInput}
              onChange={(e) => setdata({ ...data, title: e.target.value })}
            />
            <Input
              placeholder="Event Logo"
              label="Event Logo"
              type={"image"}
              value={data.logoLink?.name || ""}
              containerClassName={styles.formInput}
              onChange={(e) => setdata({ ...data, logoLink: e.target.value })}
              className={styles.formInput}
            />
            <Input
              placeholder="Select Date"
              className={styles.formInput}
              label="Event Date"
              type="date"
              style={{ width: "88%" }}
              value={data.eventDate}
              onChange={(date) => setdata({ ...data, eventDate: date })}
            />
            <Input
              placeholder="Event Type"
              label="Select Type"
              type="select"
              className={styles.formInput}
              options={[
                { label: "Paid", value: "Paid" },
                { label: "Free", value: "Free" },
              ]}
              style={{ width: "88%" }}
              value={data.eventType}
              onChange={(value) => onChangeEventType(value)}
            />
            {data.eventType === "Paid" && (
              <div>
                <Input
                  placeholder="Enter Amount"
                  label="Amount"
                  type="number"
                  value={data.amount}
                  onChange={(e) => setdata({ ...data, amount: e.target.value })}
                  className={styles.formInput}
                />
                <Input
                  placeholder={"Attach Media/Images/Qr Code"}
                  label={"Upload Media"}
                  value={data.receiverDetails.media?.name || ""}
                  className={styles.formInput}
                  containerClassName={styles.formInput}
                  type="image"
                  onChange={(e) =>
                    setdata({
                      ...data,
                      receiverDetails: {
                        ...data.receiverDetails,
                        media: e.target.value,
                      },
                    })
                  }
                />

                <Input
                  placeholder={"Enter UPI ID"}
                  label={"UPI ID"}
                  value={data.receiverDetails.upi}
                  className={styles.formInput}
                  onChange={(e) =>
                    setdata({
                      ...data,
                      receiverDetails: {
                        ...data.receiverDetails,
                        upi: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            <Input
              placeholder="Enter Event Name"
              label="Related Event Name"
              value={data.relatedEvent}
              className={styles.formInput}
              onChange={(e) =>
                setdata({ ...data, relatedEvent: e.target.value })
              }
            />
            <Input
              label="Participation Type"
              placeholder="Select Type"
              className={styles.formInput}
              type="select"
              options={[
                { label: "Individual", value: "Individual" },
                { label: "Team", value: "Team" },
              ]}
              style={{ width: "88%" }}
              value={data.participationType}
              onChange={(value) => {
                handleChangeParticipantType(value);
              }}
            />
            {data.participationType === "Team" && (
              <div>
                <Input
                  placeholder="Enter Team Size "
                  label="Team Size (Min)"
                  type="select"
                  options={TEAM_SIZE.filter(
                    (item) => item.value <= (data.maxSize || 7)
                  )}
                  className={styles.formInput}
                  value={data.minSize}
                  onChange={(value) => handleChangeMinSize(value)}
                />
                {data.minSize && (
                  <Input
                    placeholder="Enter Team Size "
                    label="Team Size (Max)"
                    type="select"
                    options={TEAM_SIZE.filter(
                      (item) => item.value >= (data.minSize || 1)
                    )}
                    className={styles.formInput}
                    value={data.maxSize}
                    onChange={(value) => handleChangeTeamSize(value)}
                  />
                )}
              </div>
            )}
            <Input
              placeholder="Event Priority"
              className={styles.formInput}
              label="Priority"
              value={data.priority}
              onChange={(e) => setdata({ ...data, priority: e.target.value })}
            />
            <Input
              placeholder="Open Date & Time"
              className={styles.formInput}
              label="Event Open Date & Time"
              type="datetime-local"
              value={data.openDT}
              onChange={(date) => {
                setdata({
                  ...data,
                  openDT: moment(date).format("MMMM Do YYYY, h:mm:ss a"),
                });
              }}
            />
          </div>
          <div
            style={{
              width: "45%",
            }}
          >
            <Input
              placeholder="Enter Event Description"
              label="Event Description"
              type="textArea"
              className={` ${styles.formInputTxtArea}`}
              value={data.description}
              onChange={(e) =>
                setdata({ ...data, description: e.target.value })
              }
            />
            <Input
              placeholder="Enter Message"
              label="Registration Success Message"
              type="textArea"
              className={` ${styles.formInputTxtArea}`}
              value={data.successMessage}
              containerStyle={{ marginTop: "12px" }}
              onChange={(e) =>
                setdata({ ...data, successMessage: e.target.value })
              }
            />
            <Input
              placeholder="Enter Number"
              className={styles.formInput}
              label="Maximum Registrations"
              type="number"
              value={data.maxReg}
              containerStyle={{ marginTop: "12px" }}
              onChange={(e) => setdata({ ...data, maxReg: e.target.value })}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "86%",
            marginBottom: "12px",
          }}
        >
          <Text
            style={{
              fontSize: "14px",
              margin: "auto 6px",
              marginRight: "auto",
            }}
          >
            Sections
          </Text>
          <Button onClick={handleSaveSection}>Save</Button>
          <Button
            variant="secondary"
            style={{ marginLeft: "12px" }}
            onClick={onAddSection}
          >
            Add Section
          </Button>
        </div>
        {sections.map((section) => (
          <div key={section._id} ref={scrollRef}>
            <Section
              section={section}
              sections={sections}
              setsections={setsections}
              showAddButton={!section.isDisabled}
              disabled={section.isDisabled}
            />
          </div>
        ))}
        {paymentSection && (
          <Section
            section={paymentSection}
            sections={sections}
            setsections={setsections}
            showAddButton={!paymentSection.isDisabled}
            disabled={paymentSection.isDisabled}
          />
        )}
        {showPreview && (
          <PreviewForm
            open={showPreview}
            handleClose={() => setshowPreview(false)}
            sections={constructForPreview()}
            eventData={data}
            meta={[paymentSection]}
          />
        )}
      </div>
    </div>
  );
}

export default NewForm;
