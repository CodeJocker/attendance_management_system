import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";

const InputField = ({ label, name, type, register, errors, ...rest }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      type={type}
      {...register(name)}
      className={`w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
        errors[name] ? 'border-red-500' : 'border-gray-300'
      }`}
      {...rest}
    />
    {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>}
  </div>
);

const AddMember = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image') {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const res = await api.post("/api/create/user/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        toast.success("Member created successfully");
        navigate("/view");
      } else {
        toast.error("Error creating member");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the member");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Add New Member
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <InputField
                label="Slug"
                name="slug"
                type="text"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Product name"
                // label="Username"
                name="username"
                type="text"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Owner First Name"
                // label="First Name"
                name="FirstName"
                type="text"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Owner Last Name"
                // label="Last Name"
                name="LastName"
                type="text"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Product price in rwf"
                // label="Phone Number"
                name="Tel"
                type="tel"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Registered at"
                // label="Date of Birth"
                name="DateOfBirth"
                type="date"
                register={register}
                errors={errors}
                required
              />
              {/* <InputField
                label="Date of Church Entry"
                name="DateOfChurchEntry"
                type="date"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Date of Cell Entry"
                name="DateOfCellEntry"
                type="date"
                register={register}
                errors={errors}
                required
              /> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo
              </label>
              <Controller
                name="image"
                control={control}
                rules={{ required: "Photo is required" }}
                render={({ field }) => (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
              />
              {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;