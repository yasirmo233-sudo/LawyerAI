"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Jurisdiction {
  code: string
  name: string
  flag: string
}

export const TOP_JURISDICTIONS: Jurisdiction[] = [
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
]

export const JURISDICTIONS: Jurisdiction[] = [
  { code: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "AI", name: "Anguilla", flag: "🇦🇮" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "AQ", name: "Antarctica", flag: "🇦🇶" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "AS", name: "American Samoa", flag: "🇦🇸" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AW", name: "Aruba", flag: "🇦🇼" },
  { code: "AX", name: "Åland Islands", flag: "🇦🇽" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "BB", name: "Barbados", flag: "🇧🇧" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "BL", name: "Saint Barthélemy", flag: "🇧🇱" },
  { code: "BM", name: "Bermuda", flag: "🇧🇲" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "BQ", name: "Caribbean Netherlands", flag: "🇧🇶" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "BV", name: "Bouvet Island", flag: "🇧🇻" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CC", name: "Cocos Islands", flag: "🇨🇨" },
  { code: "CD", name: "Democratic Republic of the Congo", flag: "🇨🇩" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "CG", name: "Republic of the Congo", flag: "🇨🇬" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "CK", name: "Cook Islands", flag: "🇨🇰" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "CV", name: "Cape Verde", flag: "🇨🇻" },
  { code: "CW", name: "Curaçao", flag: "🇨🇼" },
  { code: "CX", name: "Christmas Island", flag: "🇨🇽" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "DM", name: "Dominica", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "EH", name: "Western Sahara", flag: "🇪🇭" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "FK", name: "Falkland Islands", flag: "🇫🇰" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "FO", name: "Faroe Islands", flag: "🇫🇴" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "GD", name: "Grenada", flag: "🇬🇩" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "GF", name: "French Guiana", flag: "🇬🇫" },
  { code: "GG", name: "Guernsey", flag: "🇬🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "GI", name: "Gibraltar", flag: "🇬🇮" },
  { code: "GL", name: "Greenland", flag: "🇬🇱" },
  { code: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "GP", name: "Guadeloupe", flag: "🇬🇵" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "GS", name: "South Georgia", flag: "🇬🇸" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "GU", name: "Guam", flag: "🇬🇺" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "HM", name: "Heard Island", flag: "🇭🇲" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "IM", name: "Isle of Man", flag: "🇮🇲" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "IO", name: "British Indian Ocean Territory", flag: "🇮🇴" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JE", name: "Jersey", flag: "🇯🇪" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮" },
  { code: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "KP", name: "North Korea", flag: "🇰🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "KY", name: "Cayman Islands", flag: "🇰🇾" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "MF", name: "Saint Martin", flag: "🇲🇫" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "MO", name: "Macao", flag: "🇲🇴" },
  { code: "MP", name: "Northern Mariana Islands", flag: "🇲🇵" },
  { code: "MQ", name: "Martinique", flag: "🇲🇶" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "MS", name: "Montserrat", flag: "🇲🇸" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "NC", name: "New Caledonia", flag: "🇳🇨" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "NF", name: "Norfolk Island", flag: "🇳🇫" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "NR", name: "Nauru", flag: "🇳🇷" },
  { code: "NU", name: "Niue", flag: "🇳🇺" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "PF", name: "French Polynesia", flag: "🇵🇫" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PM", name: "Saint Pierre and Miquelon", flag: "🇵🇲" },
  { code: "PN", name: "Pitcairn Islands", flag: "🇵🇳" },
  { code: "PR", name: "Puerto Rico", flag: "🇵🇷" },
  { code: "PS", name: "Palestine", flag: "🇵🇸" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "RE", name: "Réunion", flag: "🇷🇪" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "SH", name: "Saint Helena", flag: "🇸🇭" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "SJ", name: "Svalbard and Jan Mayen", flag: "🇸🇯" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "ST", name: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "SX", name: "Sint Maarten", flag: "🇸🇽" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿" },
  { code: "TC", name: "Turks and Caicos Islands", flag: "🇹🇨" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "TF", name: "French Southern Territories", flag: "🇹🇫" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "TK", name: "Tokelau", flag: "🇹🇰" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "UM", name: "U.S. Minor Outlying Islands", flag: "🇺🇲" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "VA", name: "Vatican City", flag: "🇻🇦" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "VG", name: "British Virgin Islands", flag: "🇻🇬" },
  { code: "VI", name: "U.S. Virgin Islands", flag: "🇻🇮" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "WF", name: "Wallis and Futuna", flag: "🇼🇫" },
  { code: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "YT", name: "Mayotte", flag: "🇾🇹" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
]

interface JurisdictionSelectProps {
  value?: string
  onValueChange: (jurisdiction: string) => void
  variant?: "default" | "compact"
}

export function JurisdictionSelect({ value, onValueChange, variant = "default" }: JurisdictionSelectProps) {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("")
  const [open, setOpen] = useState(false)

  // Detect default jurisdiction from browser locale
  useEffect(() => {
    if (value) {
      setSelectedJurisdiction(value)
      return
    }

    if (typeof navigator !== "undefined") {
      const locale = navigator.language || "en-US"
      const [language, country] = locale.split("-")

      // Try to match country code first
      if (country) {
        const countryCode = country.toUpperCase()
        const jurisdiction = JURISDICTIONS.find((j) => j.code === countryCode)
        if (jurisdiction) {
          setSelectedJurisdiction(jurisdiction.code)
          onValueChange(jurisdiction.code)
          return
        }
      }

      // Fallback to US
      setSelectedJurisdiction("US")
      onValueChange("US")
    }
  }, [value, onValueChange])

  const selectedJurisdictionData = JURISDICTIONS.find((j) => j.code === selectedJurisdiction)

  const otherJurisdictions = JURISDICTIONS.filter(
    (jurisdiction) => !TOP_JURISDICTIONS.some((top) => top.code === jurisdiction.code),
  )

  if (variant === "compact") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-auto h-8 px-2 text-xs justify-between bg-transparent"
          >
            {selectedJurisdictionData ? (
              <div className="flex items-center gap-1">
                <span>{selectedJurisdictionData.flag}</span>
                <span className="hidden sm:inline">{selectedJurisdictionData.name}</span>
              </div>
            ) : (
              "Select jurisdiction..."
            )}
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search jurisdictions..." />
            <CommandList>
              <CommandEmpty>No jurisdiction found.</CommandEmpty>
              <CommandGroup heading="Most Populous Countries">
                {TOP_JURISDICTIONS.map((jurisdiction) => (
                  <CommandItem
                    key={jurisdiction.code}
                    value={`${jurisdiction.name} ${jurisdiction.code}`}
                    onSelect={() => {
                      setSelectedJurisdiction(jurisdiction.code)
                      onValueChange(jurisdiction.code)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedJurisdiction === jurisdiction.code ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="mr-2">{jurisdiction.flag}</span>
                    {jurisdiction.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="All Other Countries">
                {otherJurisdictions.map((jurisdiction) => (
                  <CommandItem
                    key={jurisdiction.code}
                    value={`${jurisdiction.name} ${jurisdiction.code}`}
                    onSelect={() => {
                      setSelectedJurisdiction(jurisdiction.code)
                      onValueChange(jurisdiction.code)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedJurisdiction === jurisdiction.code ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="mr-2">{jurisdiction.flag}</span>
                    {jurisdiction.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">Jurisdiction</span>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            {selectedJurisdictionData ? (
              <div className="flex items-center gap-2">
                <span>{selectedJurisdictionData.flag}</span>
                <span>{selectedJurisdictionData.name}</span>
              </div>
            ) : (
              "Select jurisdiction..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search jurisdictions..." />
            <CommandList>
              <CommandEmpty>No jurisdiction found.</CommandEmpty>
              <CommandGroup heading="Most Populous Countries">
                {TOP_JURISDICTIONS.map((jurisdiction) => (
                  <CommandItem
                    key={jurisdiction.code}
                    value={`${jurisdiction.name} ${jurisdiction.code}`}
                    onSelect={() => {
                      setSelectedJurisdiction(jurisdiction.code)
                      onValueChange(jurisdiction.code)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedJurisdiction === jurisdiction.code ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="mr-2">{jurisdiction.flag}</span>
                    {jurisdiction.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="All Other Countries">
                {otherJurisdictions.map((jurisdiction) => (
                  <CommandItem
                    key={jurisdiction.code}
                    value={`${jurisdiction.name} ${jurisdiction.code}`}
                    onSelect={() => {
                      setSelectedJurisdiction(jurisdiction.code)
                      onValueChange(jurisdiction.code)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedJurisdiction === jurisdiction.code ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="mr-2">{jurisdiction.flag}</span>
                    {jurisdiction.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedJurisdictionData && (
        <Badge variant="secondary" className="text-xs">
          Legal advice will be tailored to {selectedJurisdictionData.name} law
        </Badge>
      )}
    </div>
  )
}
