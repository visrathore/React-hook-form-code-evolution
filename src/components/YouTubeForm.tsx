import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

const YouTubeForm = () => {
  const form = useForm<FormValues>({
    /*This is the default values for form */
    defaultValues: {
      username: "Batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },

    /*For auto populate the values*/
    // defaultValues: async () => {
    //   const response = await fetch(
    //     "https://jsonplaceholder.typicode.com/users/1"
    //   );
    //   const data = await response.json();
    //   return {
    //     username: "Batman",
    //     email: data.email,
    //     channel: "",
    //   };
    // },
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
  } = form;
  //getValues is helpful when we need the form values for some action
  const {
    errors,
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
  } = formState;
  //touched and dirth is useful when you have to check that user has filled the form or any specific field or not

  {
    /*Form submission state
  1. isSubmitting -> default value false, when click on submit it changes to true and after form submitted it again become false
  2. isSubmitted -> default value false, when form is submitted it become true and remain true until the form is reset
  3. isSubmitSuccessful -> if form submit successfully then become true and if not then it is false, like validation error etc...
  4. submitCount -> Keep track the number of times form submitted, it incremented by 1
*/
  }

  // const {name, ref, onChange, onBlur} = register('username');

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted", data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", { errors });
    //this function will trigger if the form submission is failed, and will return the fields which have validation failed
  };

  const handleGetValues = () => {
    console.log("Get values", getValues(["username", "email"]));
    console.log("Get values", getValues("social"));
    console.log("Get values", getValues("social.facebook"));
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      //It is not recommended to call the reset method inside onSubmit form handler
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const handleSetValue = () => {
    setValue("username", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    //touched -> user has interacted with the field or not
    //Dirty -> User has modified the input or not, if it is set to initial value then it will change to false again

    //third argument is for the touched and dirty update to show error
  };

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log({ value });
  //   });
  //   return () => subscription.unsubscribe();
  // }, []);

  // const watchForm = watch(); //it will watch all the fields if empty
  // const watchFormUsername = watch('username'); //it will only watch the username field
  // const watchFormArray = watch(['username', 'email']); //it will watch both the fields

  renderCount++;
  return (
    <div>
      <h1>YouTube Form: {renderCount / 2}</h1>
      {/* <h2>{JSON.stringify(watchForm)}</h2>{" "} */}
      {/*It will show the live value when typing in input */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            //registering the field with react-hook-form
            {...register("username", {
              required: {
                value: true,
                message: "Username is required!",
              },
            })}
          />
          <p className="error">{errors.username?.message}</p>
          {/* <input type="text" id="username" name={name} ref={ref} onChange={onChange} onBlur={onBlur} /> */}
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            //registering the field with react-hook-form
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email format",
              },
              required: {
                value: true,
                message: "Email is required",
              },
              //custom validation
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter a different email address"
                  );
                },
                notBlacklisted: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: "Channel is required!",
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              disabled: watch("channel") === "",
              required: "Enter twitter profile",
            })}
          />
          {/*if we disable the field, validation will also be disabled */}
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone Number</label>
          <input
            type="text"
            id="primary-phone"
            {...register("phoneNumbers.0")}
          />
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone Number</label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phoneNumbers.1")}
          />
        </div>

        <div>
          <label htmlFor="">List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: "" })}>
              Add phone number
            </button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true, //this will set the value as number instead of string
              required: "Age is required!",
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true, //we get a proper date value instead of string value
              required: "Date of birth is required!",
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        <button disabled={!isDirty || !isValid || isSubmitting}>Submit</button>
        {/*Disable the submit button if input not changed or validation not passed */}
        <button type="button" onClick={() => reset()}>
          Reset
          {/*Reset -> it will change the form values to default, not the empty input */}
        </button>
        <button type="button" onClick={handleGetValues}>
          Get Values
        </button>
        <button type="button" onClick={handleSetValue}>
          Set Value
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YouTubeForm;

// React-hook-form -> it will not rerender the component when we change the input text,very performant
