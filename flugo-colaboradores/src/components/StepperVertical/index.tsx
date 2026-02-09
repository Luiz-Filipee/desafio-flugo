import { Stepper, Step, StepLabel } from '@mui/material';

const ETAPAS = ['Infos Básicas', 'Infos Profissionais'];

export default function StepperVertical({ etapaAtiva }: { etapaAtiva: number }) {
  return (
    <Stepper activeStep={etapaAtiva} orientation="vertical">
      {ETAPAS.map(etapa => (
        <Step key={etapa}>
          <StepLabel>{etapa}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
