import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

interface Option {
    id: number;
    name: string;
}

interface SelectProps {
    options: Option[],  
    title?: string,
    data_name: string,
    selected_value: string,
    setData: (key: any, value: any)=> void
}


export function SelectSingle({ options, title = "Select Data", data_name, setData, selected_value }: SelectProps) {


    const handleChange = (val: string) => {
        setData(data_name, val);
    };

    return (
        <Select value={selected_value.toString() || ''} onValueChange={handleChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={title} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}