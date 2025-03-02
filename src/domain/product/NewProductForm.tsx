import { memo } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNewProduct } from './hooks/product_hooks'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertDialogFooter } from '../../components/ui/alert-dialog'
import { Button } from '../../components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters.' })
    .max(50, { message: 'Title must be at most 100 characters.' }),
  barcode: z
    .string()
    .min(3, { message: 'Barcode must be at least 3 characters.' })
    .max(50, { message: 'Barcode must be at most 50 characters.' }),
})

function NewProductForm({
  producerId,
  onClose,
}: {
  producerId: string
  onClose: () => void
}) {
  const newProductMutation = useNewProduct()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    newProductMutation.mutate(
      {
        producer_id: producerId,
        title: values.title,
        barcode: values.barcode,
      },
      {
        onSuccess: () => {
          toast.success('Product created')
          onClose()
        },
        onError: (error) => {
          toast.error('Product creation failed.')
          console.error(error)
        },
      }
    )
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 5449000000996" {...field} />
              </FormControl>
              <FormDescription>
                What&apos;s your product barcode?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Coca-Cola Zero" {...field} />
              </FormControl>
              <FormDescription>What&apos;s your product title?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </AlertDialogFooter>
      </form>
    </Form>
  )
}

export default memo(NewProductForm)
