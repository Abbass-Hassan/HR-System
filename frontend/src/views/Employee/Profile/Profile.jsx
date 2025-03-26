import './Profile.css'
import PageHeader from '../../../components/common/PageHeader/PageHeader'
import profileImage from '../../../assets/images/rechardHendricks.jpg'
import iconFirstName from '../../../assets/images/first_name.svg'
import iconEmail from '../../../assets/images/email.svg'
import iconPassword from '../../../assets/images/password.svg'
import iconPhone from '../../../assets/images/phone.svg'
import { useUser } from '../../../context/User/useUser'
import api from '../../../services/Api'
import { useToast } from '../../../context/Toast/Toast'

import { useEffect, useState } from 'react'
const Profile = () => {
  const { user, setUser } = useUser()
  const { showToast } = useToast()
  const [employee, setEmployee] = useState({})
  const [changePassword, setChangePassword] = useState(false)
  const [fullname, setFullName] = useState(
    employee?.first_name + ' ' + employee?.last_name
  )
  const [image, setImage] = useState(
    'http://localhost:8000' + '/' + user?.profile_image
  )
  const [oldImage, setOldImage] = useState(image)
  const [file, setFile] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setEmployee({
      first_name: user?.first_name,
      last_name: user?.last_name,
      phone_number: user?.phone_number || '',
      email: user?.email,
      password: user?.password,
      confirm_password: user?.confirm_password,
    })
    setFullName(user?.first_name + ' ' + user?.last_name)
    console.log(user)
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitProfile = async (e) => {
    e.preventDefault()

    if (employee.password !== employee.confirm_password) {
      showToast('Error', 'Passwords do not match')
      return
    }

    try {
      const response = await api.post(
        `/api/v0.1/employee/editprofile/${changePassword ? 'change' : ''}`,
        employee
      )

      if (response.data.success) {
        setUser({
          ...user,
          ...employee,
          password: '',
          confirm_password: '',
        })
        showToast('Success', response.data.message)
      } else {
        showToast('Error', 'Error updating profile')
      }
    } catch (error) {
      showToast('Error', error.response.data.message)
    }
  }

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      setImage(URL.createObjectURL(selectedFile))
      setFile(selectedFile)
    }
  }

  const handleUpdatProfileImage = async () => {
    try {
      if (file) {
        const fromdata = new FormData()
        fromdata.append('image', file)
        const response = await api.post(
          `/api/v0.1/employee/editprofileimage`,
          fromdata
        )
        if (response.data?.success) {
          setUser({ ...user, profile_image: response.data?.profile_image })
          setIsOpen(false)
          showToast('Success', response.data?.message)
        }
      }
    } catch (error) {
      showToast('Error', error.response.data.message)
    }
  }
  return (
    <div className='employee-profile-page'>
      <PageHeader
        title={'Employee Profile'}
        subTitle={'Employee'}
        subSubTitle={'Profile'}
      />
      <div className='employee-profile'>
        <div className='inside-container'>
          <div className='profile-image-title'>
            <img
              className='profile-image'
              src={user?.profile_image ? image : profileImage}
              alt='profile-image.jpg'
              onClick={() => setIsOpen(true)}
            />
            <div className='profile-employee-name'>{fullname}</div>
          </div>
          {isOpen && (
            <div className='modal-overlay'>
              <div className='modal-content'>
                <p className='modal-title'>Update Profile Image</p>
                <img
                  className='modal-image-preview'
                  src={image}
                  alt='preview'
                />
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='model-file-input'
                />
                <div className='modal-buttons'>
                  <button
                    className='cancel-button'
                    onClick={() => {
                      setIsOpen(false)
                      setImage(oldImage)
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className='submit-button'
                    onClick={handleUpdatProfileImage}
                  >
                    Update Image
                  </button>
                </div>
              </div>
            </div>
          )}
          <form className='profile-form'>
            {/* row 2 inputs next to each other  */}
            <div className='two-form-inputs'>
              <div className='form-input'>
                <label>First Name</label>
                <div className='form-input-icon'>
                  <input
                    type='text'
                    value={employee.first_name}
                    name='first_name'
                    onChange={handleChange}
                  />
                  <img
                    className='input-icon'
                    src={iconFirstName}
                    alt='icon-first-name.svg'
                  />
                </div>
              </div>
              <div className='form-input'>
                <label>Last Name</label>
                <div className='form-input-icon'>
                  <input
                    type='text'
                    value={employee.last_name}
                    name='last_name'
                    onChange={handleChange}
                  />
                  <img
                    className='input-icon'
                    src={iconFirstName}
                    alt='icon-first-name.svg'
                  />
                </div>
              </div>
            </div>
            {/* row 2 inputs next to each other  */}

            {/* row 2 inputs next to each other  */}
            <div className='two-form-inputs'>
              <div className='form-input'>
                <label>Email</label>
                <div className='form-input-icon'>
                  <input
                    type='email'
                    value={employee.email}
                    name='email'
                    onChange={handleChange}
                  />
                  <img
                    className='input-icon'
                    src={iconEmail}
                    alt='icon-email-name.svg'
                  />
                </div>
              </div>
              <div className='form-input'>
                <label>Phone</label>
                <div className='form-input-icon'>
                  <input
                    type='text'
                    value={employee.phone_number}
                    name='phone_number'
                    onChange={handleChange}
                    placeholder={'N/A'}
                  />
                  <img
                    className='input-icon'
                    src={iconPhone}
                    alt='icon-phone-name.svg'
                  />
                </div>
              </div>
            </div>
            {/* row 2 inputs next to each other  */}

            <div className='change-password-container'>
              <label>Change Password</label>
              <br />
              <label className='switch'>
                <input
                  type='checkbox'
                  checked={changePassword}
                  onChange={() => setChangePassword(!changePassword)}
                />
                <span className='slider round'></span>
              </label>
            </div>

            {/* row 2 inputs next to each other  */}
            {changePassword && (
              <>
                <div className='two-form-inputs'>
                  <div className='form-input'>
                    <label>Password</label>
                    <div className='form-input-icon'>
                      <input
                        type='password'
                        value={employee.password}
                        name='password'
                        onChange={handleChange}
                        placeholder='new password'
                      />
                      <img
                        className='input-icon'
                        src={iconPassword}
                        alt='icon-password-name.svg'
                      />
                    </div>
                  </div>
                  <div className='form-input'>
                    <label>Confirm Password</label>
                    <div className='form-input-icon'>
                      <input
                        type='password'
                        value={employee.confirm_password}
                        name='confirm_password'
                        onChange={handleChange}
                        placeholder='confirm new password'
                      />
                      <img
                        className='input-icon'
                        src={iconPassword}
                        alt='icon-password-name.svg'
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* row 2 inputs next to each other  */}
            <button
              className='button-submit-profile'
              onClick={handleSubmitProfile}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
