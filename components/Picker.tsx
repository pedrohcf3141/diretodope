import * as React from 'react'
import ModalSelector from 'react-native-modal-selector'

import InputField from './InputField'

type PickerProps = {
  data: string[]
  initialValue: string
  onChange: (value: string) => void
  value: string
  placeholder: string
  inputIcon?: string
}

export default function Picker(props: PickerProps) {
  const {
    data,
    initialValue,
    onChange,
    value,
    placeholder,
    inputIcon = 'caret-down',
  } = props
  const dataWithTitle = [
    { key: 'title', section: true, label: placeholder },
    ...data.map((item) => ({ key: item, label: item })),
  ]
  return (
    <ModalSelector
      // @ts-ignore
      data={dataWithTitle}
      initValue={initialValue}
      onChange={(item) => onChange(item.label)}
      cancelText='cancelar'
    >
      <InputField
        icon={inputIcon}
        value={value}
        editable={false}
        placeholder={placeholder}
      />
    </ModalSelector>
  )
}
