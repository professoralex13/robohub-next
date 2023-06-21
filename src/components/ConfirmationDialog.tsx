/**
 * Confirmation Context handles showing of confirmation dialogs which can be used in scenarios where the user may be about to perform a destructive action
 */

import { m } from 'framer-motion';
import { FC, PropsWithChildren, ReactElement, useCallback } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import { useDialogContext } from '@/app/contexts/DialogContext';

interface ConfirmationDialogProps {
    onSelect: (value: boolean) => void;
}

/**
 * Popup card which prompts the user to make a yes or no decision
 */
export const ConfirmationDialog: FC<PropsWithChildren<ConfirmationDialogProps>> = ({ onSelect, children }) => (
    <m.div
        className="card flex flex-col items-center gap-2 p-3"
        initial={{ y: 150 }}
        animate={{ y: 0 }}
        exit={{ y: 150 }}
    >
        <span className="w-full text-left text-2xl">Confirm</span>
        <span className="text-lg">{children}</span>
        <div className="flex w-full justify-between">
            <CircleX size={40} className="cursor-pointer duration-200 hover:stroke-red-500" onClick={() => onSelect(false)} />
            <CircleCheck size={40} className="cursor-pointer duration-200 hover:stroke-green-500" onClick={() => onSelect(true)} />
        </div>
    </m.div>
);

/**
 * Returns a hook function which can be called to prompt the user to make a yes or no decision
 * @return - A boolean Promise that will resolve once the user either selects an option, or closes the dialog
 */
export const useConfirmation = () => {
    const openDialog = useDialogContext();

    // Return a callback which when called, will return a Promise which resolves to a boolean once the user makes a decision
    return useCallback((value: ReactElement) => new Promise<boolean>((resolve) => {
        openDialog(
            <ConfirmationDialog onSelect={(value) => {
                resolve(value);
                openDialog(null);
            }}
            >
                {value}
            </ConfirmationDialog>,
            () => resolve(false),
        );
    }), [openDialog]);
};
