import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";

const InputField = ({ label, name, type, register, errors, ...rest }) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-semibold text-slate-600">{label}</span>
    </label>
    <input
      type={type}
      {...register(name)}
      className={`input input-bordered bg-white border-slate-600 focus:outline-blue-700 w-full ${errors[name] ? 'input-error' : ''}`}
      {...rest}
    />
    {errors[name] && <span className="text-red-500 text-xs mt-1">{errors[name].message}</span>}
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
    <div className="flex items-center justify-center py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add New Member
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <InputField
                label="Slug"
                name="slug"
                type="text"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Username"
                name="username"
                type="text"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="First Name"
                name="FirstName"
                type="text"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Last Name"
                name="LastName"
                type="text"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Phone Number"
                name="Tel"
                type="tel"
                register={register}
                errors={errors}
                required
              />
              <InputField
                label="Date of Birth"
                name="DateOfBirth"
                type="date"
                register={register}
                errors={errors}
                required
              />
              <InputField
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
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <Controller
                name="image"
                control={control}
                rules={{ required: "Photo is required" }}
                render={({ field }) => (
                  <input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image.message}</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;