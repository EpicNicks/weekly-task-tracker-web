import { TextField, TextFieldProps } from '@mui/material'
import { useState } from 'react'
import { match } from 'ts-pattern'


type NumericFieldProps = TextFieldProps & {
    numericmode: 'decimal' | 'integer'
    maxDecimalPlaces?: number
    max?: number
    min?: number
}

export default function NumericField(props: NumericFieldProps) {
    const {
        numericmode,
        maxDecimalPlaces,
        max,
        min,
    } = props

    const [curInput, setCurInput] = useState<string>('')

    // progressively captures to validate by progressively tighening the conditions (backmost group to frontmost)
    // {1,} capture group means 1 to unlimited (equivalent to +), so we turn undefined into nothing for no limit
    // (^[0-9]+\.[0-9]{1,N}$), (^[0-9]+\.$), (^[0-9]+$)

    const inputFilter = match(numericmode)
        .with('decimal', () => new RegExp(`(^[0-9]+\\.[0-9]{1,${maxDecimalPlaces ?? ''}}$)|(^[0-9]+\\.$)|(^[0-9]+$)`, 'm'))
        .with('integer', () => /^[0-9]+$/m)
        .exhaustive()

    return (
        <TextField
            {...props}
            value={props.value ?? curInput}
            onChange={(changeEvent) => {
                const value = changeEvent.target.value
                if (value !== '' && !inputFilter.test(value)) {
                    changeEvent.target.value = ''
                    return
                }
                const numericValue = match(numericmode)
                    .with('decimal', () => Number.parseFloat(value))
                    .with('integer', () => Number.parseInt(value))
                    .exhaustive()
                if (!!max && numericValue > max) {
                    changeEvent.target.value = ''
                    return
                }
                if (!!min && numericValue < min) {
                    changeEvent.target.value = ''
                    return
                }
                setCurInput(value)
                changeEvent.target.value = value
                props.onChange?.(changeEvent)
            }}
        />
    )
}