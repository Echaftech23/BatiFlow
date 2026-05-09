import { Mail, Phone, User } from "lucide-react-native";
import { Controller, useFormContext } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import type { BookingClientFormValues } from "@/shared/schemas/forms";

type FieldConfig = {
  name: keyof BookingClientFormValues;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words";
};

const ICON_COLOR = "#737373";
const ICON_SIZE = 20;

const FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "Nom et prénom",
    placeholder: "Nom et prénom",
    icon: <User size={ICON_SIZE} color={ICON_COLOR} strokeWidth={1.8} />,
    autoCapitalize: "words",
  },
  {
    name: "email",
    label: "Adresse e-mail",
    placeholder: "Entrez votre e-mail",
    icon: <Mail size={ICON_SIZE} color={ICON_COLOR} strokeWidth={1.8} />,
    keyboardType: "email-address",
    autoCapitalize: "none",
  },
  {
    name: "phone",
    label: "Téléphone",
    placeholder: "(000) 000 00 00",
    icon: <Phone size={ICON_SIZE} color={ICON_COLOR} strokeWidth={1.8} />,
    keyboardType: "phone-pad",
  },
  {
    name: "address",
    label: "Adresse postale",
    placeholder: "Ex : 12 rue de la République",
    autoCapitalize: "sentences",
  },
  {
    name: "zip",
    label: "Code postal",
    placeholder: "Ex : 75008",
    keyboardType: "phone-pad",
  },
  {
    name: "city",
    label: "Ville",
    placeholder: "Exemple : Lyon",
    autoCapitalize: "words",
  },
  {
    name: "serviceLabel",
    label: "Motif du rendez-vous",
    placeholder: "EX : Remplacement chauffe-eau ....",
    autoCapitalize: "sentences",
  },
];

type BookingClientFormProps = {
  isPending: boolean;
  onSubmit: () => void;
  title?: string;
  subtitle?: string;
};

export function BookingClientForm({ isPending, onSubmit, title, subtitle }: BookingClientFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<BookingClientFormValues>();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-screen-x pb-10"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Scrollable title / subtitle */}
      {title || subtitle ? (
        <View className="mb-10 mt-6">
          {title ? (
            <Text className="text-center font-bold font-quicksand text-[20px] text-navy">
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text className="mt-2 text-center font-sans text-body text-muted-foreground">
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* Form card */}
      <View
        className="rounded-[32px] bg-surface border border-[#C5CBD3] px-6 py-8"
      >
        {FIELDS.map((field, index) => (
          <View key={field.name} className={index > 0 ? "mt-6" : ""}>
            <Text className="mb-1.5 font-sans-medium text-[13px] font-medium text-[#737373]">
              {field.label}
            </Text>
            <Controller
              control={control}
              name={field.name}
              render={({ field: f }) => (
                <View
                  className={`flex-row items-${field.multiline ? "start" : "center"} bg-white rounded-[18px] border border-[#E5E5E5] px-5 ${field.multiline ? "py-4" : "py-0"}`}
                >
                  {field.icon ? (
                    <View className="mr-3">{field.icon}</View>
                  ) : null}
                  <TextInput
                    value={f.value ?? ""}
                    onChangeText={f.onChange}
                    onBlur={f.onBlur}
                    placeholder={field.placeholder}
                    placeholderTextColor="#C0C0C8"
                    keyboardType={field.keyboardType ?? "default"}
                    autoCapitalize={field.autoCapitalize ?? "sentences"}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 3 : 1}
                    className={`flex-1 font-sans text-[12px] text-[#737373] ${field.multiline ? "" : "py-4"}`}
                    style={field.multiline ? { minHeight: 72, textAlignVertical: "top" } : undefined}
                  />
                </View>
              )}
            />
            {errors[field.name] ? (
              <Text className="mt-1 font-sans text-[12px] text-destructive">
                {errors[field.name]?.message}
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      {/* Submit button */}
      <Pressable
        disabled={isPending}
        onPress={onSubmit}
        className={`mt-9 rounded-full py-4 ${isPending ? "bg-[#E5E5E5]" : "bg-primary"}`}
      >
        {isPending ? (
          <ActivityIndicator color="#A3A3A3" />
        ) : (
          <Text className="text-center font-sans-semibold text-[16px] text-on-primary">
            Confirmer
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
