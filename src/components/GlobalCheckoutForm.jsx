import { useEffect, useMemo, useState } from "react";

function clampStr(v) {
  return (v ?? "").toString();
}

function GlobalCheckoutForm() {
  // Country별 설정(통화/배송비/전화 포맷/우편번호 패턴/주소 필드 구성)
  const countryConfig = useMemo(
    () => ({
      US: {
        currency: "USD",
        currencySymbol: "$",
        shippingCost: { standard: 0, express: 15, priority: 30 },
        phoneFormat: "+1 XXX XXX XXXX",
        postalCodePattern: /^\d{5}(-\d{4})?$/,
        addressFields: ["address", "city", "state", "zip"],
        freeShippingThreshold: 60,
      },
      UK: {
        currency: "GBP",
        currencySymbol: "£",
        shippingCost: { standard: 0, express: 15, priority: 30 },
        phoneFormat: "+44 XX XXX XXXX",
        postalCodePattern: /^[A-Za-z0-9 ]{5,8}$/,
        addressFields: ["address", "city", "county", "postcode"],
        freeShippingThreshold: 60,
      },
      JP: {
        currency: "JPY",
        currencySymbol: "¥",
        shippingCost: { standard: 0, express: 1500, priority: 3000 },
        phoneFormat: "+81 XX XXXX XXXX",
        postalCodePattern: /^\d{3}-\d{4}$/,
        addressFields: ["postalCode", "prefecture", "city", "address"],
        freeShippingThreshold: 8000,
      },
      AU: {
        currency: "AUD",
        currencySymbol: "A$",
        shippingCost: { standard: 0, express: 15, priority: 30 },
        phoneFormat: "+61 XX XXX XXX",
        postalCodePattern: /^\d{4}$/,
        addressFields: ["address", "suburb", "state", "postcode"],
        freeShippingThreshold: 60,
      },
    }),
    []
  );

  // “우편번호”로 취급할 수 있는 필드들
  const postalFieldKeys = useMemo(() => ["zip", "postcode", "postalCode"], []);

  // 폼에서 사용할 모든 키(국가가 바뀌어도 상태 초기화/유지 처리가 쉬움)
  const ALL_FIELD_KEYS = useMemo(
    () => [
      "email",
      "firstName",
      "lastName",
      "address",
      "aptSuite",
      "city",
      "state",
      "zip",
      "postcode",
      "postalCode",
      "county",
      "prefecture",
      "suburb",
      "phoneFirst",
      "phoneMiddle",
      "phoneLast",
    ],
    []
  );

  const buildInitialValues = () =>
    Object.fromEntries(ALL_FIELD_KEYS.map((k) => [k, ""]));

  const [selectedCountry, setSelectedCountry] = useState("US");
  const [formValues, setFormValues] = useState(() => buildInitialValues());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [billingSame, setBillingSame] = useState(true);
  const [subtotal, setSubtotal] = useState(67);
  const [tax, setTax] = useState(5.56);
  const [total, setTotal] = useState(0);

  // 현재 국가에서 “우편번호” 역할을 하는 실제 필드 키를 찾음
  const getPostalFieldKey = (country) => {
    return countryConfig[country].addressFields.find((field) =>
      postalFieldKeys.includes(field)
    );
  };

  // "+1 XXX XXX XXXX" -> ["XXX","XXX","XXXX"]
  const getPhoneSegments = (country) => {
    return countryConfig[country].phoneFormat.split(" ").slice(1);
  };

  // 이메일 형식 검증: 값이 비어 있으면 에러 없음
  const validateEmailFormat = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(trimmed) ? "" : "Invalid email format";
  };

  // 우편번호 형식 검증: 값이 비어 있으면 에러 없음
  const validatePostalCode = (value, country) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const pattern = countryConfig[country].postalCodePattern;
    return pattern.test(trimmed) ? "" : "Invalid postal code format";
  };

  // 전화번호 검증:
  // - 입력이 전혀 없으면 에러 없음
  // - 숫자만 허용, 길이 초과/미완성 체크
  const validatePhone = (country, values) => {
    const { phoneFirst, phoneMiddle, phoneLast } = values;
    const segments = getPhoneSegments(country);
    const [first, middle, last] = segments;

    const expectedLengths = [first, middle, last].map((segment) =>
      segment.replace(/[^X]/g, "").length
    );

    const parts = [phoneFirst, phoneMiddle, phoneLast];
    const hasAnyInput = parts.some((part) => part.length > 0);
    if (!hasAnyInput) return "";

    const isNumeric = parts.every((part) => part === "" || /^\d+$/.test(part));
    if (!isNumeric) return "Phone must contain only numbers";

    const isTooLong = parts.some((part, i) => part.length > expectedLengths[i]);
    if (isTooLong) return "Phone number is too long";

    const isComplete = parts.every((part, i) => part.length === expectedLengths[i]);
    return isComplete ? "" : "Phone number is incomplete";
  };

  // 공통 입력 업데이트
  const updateField = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // 전화 입력은 숫자만 저장
  const updatePhoneField = (name, value) => {
    const digitsOnly = value.replace(/\D/g, "");
    updateField(name, digitsOnly);
  };

  // blur가 발생한 필드만 “검증/에러 표시 대상”으로 처리
  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // 국가 변경 시 주소 관련 입력값을 초기화
  const handleCountryChange = (e) => {
    const nextCountry = e.target.value;
    setSelectedCountry(nextCountry);

    const resetFields = [
      ...countryConfig[nextCountry].addressFields,
      "aptSuite",
      "phoneFirst",
      "phoneMiddle",
      "phoneLast",
    ];

    const allAddressLike = [
      "address",
      "aptSuite",
      "city",
      "state",
      "zip",
      "postcode",
      "postalCode",
      "county",
      "prefecture",
      "suburb",
    ];

    setFormValues((prev) => {
      const next = { ...prev };
      [...new Set([...resetFields, ...allAddressLike])].forEach((k) => {
        next[k] = "";
      });
      return next;
    });

    setTouched((prev) => {
      const next = { ...prev };
      [...new Set([...resetFields, ...allAddressLike, "phone"])].forEach((k) => {
        delete next[k];
      });
      return next;
    });

    setErrors((prev) => {
      const next = { ...prev };
      ["postalCode", "phone", "email"].forEach((k) => delete next[k]);
      return next;
    });
  };

  useEffect(() => {
    const selectedShippingCost = countryConfig[selectedCountry].shippingCost[shippingMethod] ?? 0;
    setTotal(subtotal + tax + selectedShippingCost);
  }, [subtotal, tax, shippingMethod]);

  // Enter 키로 다음 입력 요소로 포커스 이동
  const handlePressEnter = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const container = e.currentTarget.closest(".global-checkout-form");
    if (!container) return;

    const focusable = Array.from(
      container.querySelectorAll("input, select, textarea, button")
    ).filter((el) => !el.disabled && el.type !== "hidden" && el.tabIndex !== -1);

    const currentIndex = focusable.indexOf(e.currentTarget);
    const nextInput = focusable[currentIndex + 1];

    if (nextInput) nextInput.focus();
    else container.querySelector(".continue-to-payment-btn")?.click();
  };

  // 형식 기반 유효성 검증 수행
  useEffect(() => {
    const postalKey = getPostalFieldKey(selectedCountry);

    const nextErrors = {};

    if (touched.email) {
      nextErrors.email = validateEmailFormat(formValues.email);
    }

    if (postalKey && touched[postalKey]) {
      nextErrors.postalCode = validatePostalCode(
        clampStr(formValues[postalKey]),
        selectedCountry
      );
    }

    if (touched.phone) {
      nextErrors.phone = validatePhone(selectedCountry, formValues);
    }

    setErrors(nextErrors);
  }, [formValues, selectedCountry, touched, countryConfig, postalFieldKeys]);

  const postalKey = getPostalFieldKey(selectedCountry);
  const phoneSegments = getPhoneSegments(selectedCountry);

  const standardCost = countryConfig[selectedCountry].shippingCost.standard ?? 0;
  const expressCost = countryConfig[selectedCountry].shippingCost.express ?? 0;
  const priorityCost = countryConfig[selectedCountry].shippingCost.priority ?? 0;

  const selectedShippingCost =
    countryConfig[selectedCountry].shippingCost[shippingMethod] ?? 0;

  return (
    <div className="global-checkout-form">
      <h1>Shipping Information</h1>

      <div className="country-group">
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          value={selectedCountry}
          onChange={handleCountryChange}
          onKeyDown={handlePressEnter}
        >
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="JP">Japan</option>
          <option value="AU">Australia</option>
        </select>
      </div>

      <div className="email-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={formValues.email}
          onChange={(e) => updateField("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          onKeyDown={handlePressEnter}
        />
        {touched.email && errors.email && (
          <div className="field-error">{errors.email}</div>
        )}
      </div>

      <div className="name-field">
        <div className="first-name-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            placeholder="First Name"
            value={formValues.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            onKeyDown={handlePressEnter}
          />
        </div>

        <div className="last-name-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={formValues.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            onKeyDown={handlePressEnter}
          />
        </div>
      </div>

      <div className="address-field">
        {countryConfig[selectedCountry].addressFields.map((field) => (
          <div key={field} className="address-input-group">
            {field === "state" && selectedCountry === "US" ? (
              <>
                <label htmlFor="state">State:</label>
                <select
                  id="state"
                  name="state"
                  value={formValues.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  onKeyDown={handlePressEnter}
                >
                  <option value="">Select</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                </select>
              </>
            ) : field === "address" ? (
              <>
                <div className="address-group">
                  <label htmlFor="address">Address:</label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Address"
                    value={formValues.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    onKeyDown={handlePressEnter}
                  />
                </div>

                <div className="apt-suite-group">
                  <label htmlFor="aptSuite">Apt/Suite:</label>
                  <input
                    id="aptSuite"
                    type="text"
                    placeholder="Apt/Suite"
                    value={formValues.aptSuite}
                    onChange={(e) => updateField("aptSuite", e.target.value)}
                    onKeyDown={handlePressEnter}
                  />
                </div>
              </>
            ) : (
              <>
                <label htmlFor={field}>{field}:</label>
                <input
                  id={field}
                  className="address-input"
                  type="text"
                  placeholder={field}
                  value={clampStr(formValues[field])}
                  onChange={(e) => updateField(field, e.target.value)}
                  onBlur={() => {
                    if (postalKey === field) handleBlur(field);
                  }}
                  onKeyDown={handlePressEnter}
                />

                {postalKey === field && touched[field] && errors.postalCode && (
                  <div className="field-error">{errors.postalCode}</div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="phone-group">
        <label htmlFor="phoneFirst">Phone:</label>
        <span>{countryConfig[selectedCountry].phoneFormat.split(" ")[0]}</span>

        <input
          id="phoneFirst"
          type="text"
          className="phone-first"
          placeholder={phoneSegments[0]}
          maxLength={phoneSegments[0].replace(/[^X]/g, "").length}
          value={formValues.phoneFirst}
          onChange={(e) => updatePhoneField("phoneFirst", e.target.value)}
          onBlur={() => handleBlur("phone")}
          onKeyDown={handlePressEnter}
        />
        <span>-</span>

        <input
          id="phoneMiddle"
          type="text"
          className="phone-middle"
          placeholder={phoneSegments[1]}
          maxLength={phoneSegments[1].replace(/[^X]/g, "").length}
          value={formValues.phoneMiddle}
          onChange={(e) => updatePhoneField("phoneMiddle", e.target.value)}
          onBlur={() => handleBlur("phone")}
          onKeyDown={handlePressEnter}
        />
        <span>-</span>

        <input
          id="phoneLast"
          type="text"
          className="phone-last"
          placeholder={phoneSegments[2]}
          maxLength={phoneSegments[2].replace(/[^X]/g, "").length}
          value={formValues.phoneLast}
          onChange={(e) => updatePhoneField("phoneLast", e.target.value)}
          onBlur={() => handleBlur("phone")}
          onKeyDown={handlePressEnter}
        />

        {touched.phone && errors.phone && (
          <div className="field-error">{errors.phone}</div>
        )}
      </div>

      <div className="shipping-method-group">Shipping Method</div>

      <div className="shipping-method-options">
        <label>
          <input
            type="radio"
            name="shipping-method"
            value="standard"
            checked={shippingMethod === "standard"}
            onChange={(e) => setShippingMethod(e.target.value)}
            onKeyDown={handlePressEnter}
          />
          <span> Standard (7-14 days)</span>
          <span>
            {" "}
            {standardCost === 0
              ? "Free"
              : `${countryConfig[selectedCountry].currencySymbol}${standardCost.toFixed(
                  2
                )}`}
          </span>
        </label>
      </div>

      <div className="shipping-method-options">
        <label>
          <input
            type="radio"
            name="shipping-method"
            value="express"
            checked={shippingMethod === "express"}
            onChange={(e) => setShippingMethod(e.target.value)}
            onKeyDown={handlePressEnter}
          />
          <span> Express (3-5 days)</span>
          <span>
            {" "}
            {countryConfig[selectedCountry].currencySymbol}
            {expressCost.toFixed(2)}
          </span>
        </label>
      </div>

      <div className="shipping-method-options">
        <label>
          <input
            type="radio"
            name="shipping-method"
            value="priority"
            checked={shippingMethod === "priority"}
            onChange={(e) => setShippingMethod(e.target.value)}
            onKeyDown={handlePressEnter}
          />
          <span> Priority (1-3 days)</span>
          <span>
            {" "}
            {countryConfig[selectedCountry].currencySymbol}
            {priorityCost.toFixed(2)}
          </span>
        </label>
      </div>

      <div className="billing-address-group">
        <input
          id="billingSame"
          type="checkbox"
          name="billingSame"
          checked={billingSame}
          onChange={(e) => setBillingSame(e.target.checked)}
          onKeyDown={handlePressEnter}
        />
        <label htmlFor="billingSame">Billing address same as shipping</label>
      </div>

      <ul className="total-list">
        <li>
          <span>Subtotal:</span>
          <span>{countryConfig[selectedCountry].currencySymbol}{subtotal.toFixed(2)}</span>
        </li>
        <li>
          <span>Shipping:</span>
          <span>
            {countryConfig[selectedCountry].currencySymbol}
            {selectedShippingCost.toFixed(2)}
          </span>
        </li>
        <li>
          <span>Estimated Tax:</span>
          <span>{countryConfig[selectedCountry].currencySymbol}{tax.toFixed(2)}</span>
        </li>
        <li>
          <span>Total &#40;{countryConfig[selectedCountry].currency}&#41;:</span>
          <span>{countryConfig[selectedCountry].currencySymbol}{total.toFixed(2)}</span>
        </li>
      </ul>

      <button className="continue-to-payment-btn" type="button">
        Continue to Payment
      </button>
    </div>
  );
}

export default GlobalCheckoutForm;
