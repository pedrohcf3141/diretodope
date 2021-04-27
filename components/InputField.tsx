import * as React from 'react'
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native'

import { FontAwesome5 } from '@expo/vector-icons'

import Colors from '../constants/Colors'

type InputFieldProps = TextInputProps & { icon?: string }

export default function InputField({ icon, ...props }: InputFieldProps) {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholderTextColor='rgba(0,0,0,0.4)'
        {...props}
      />
      {icon && (
        <View style={styles.inputIcon}>
          <FontAwesome5 name={icon} size={16} color='rgba(0,0,0,0.5)' />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    height: 48,
    color: Colors.offblack,
  },
  inputIcon: {
    position: 'absolute',
    height: '100%',
    top: 0,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
